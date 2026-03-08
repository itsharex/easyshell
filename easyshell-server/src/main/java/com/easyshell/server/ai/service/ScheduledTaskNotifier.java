package com.easyshell.server.ai.service;

import com.easyshell.server.ai.channel.ChannelMessageRouter;
import com.easyshell.server.ai.model.entity.AiInspectReport;
import com.easyshell.server.ai.model.entity.AiScheduledTask;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class ScheduledTaskNotifier {
    private final ChannelMessageRouter channelMessageRouter;
    private final ChatModelFactory chatModelFactory;

    public ScheduledTaskNotifier(@Lazy ChannelMessageRouter channelMessageRouter,
                                 ChatModelFactory chatModelFactory) {
        this.channelMessageRouter = channelMessageRouter;
        this.chatModelFactory = chatModelFactory;
    }

    private static final int MAX_ANALYSIS_LENGTH = 1500;
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 根据策略决定是否推送通知。
     *
     * @param task           定时任务
     * @param report         巡检报告
     * @param notifyStrategy 通知策略: none / always / on_alert / on_failure / ai_decide
     * @param notifyChannels 通知渠道列表
     */
    public void notify(AiScheduledTask task, AiInspectReport report,
                       String notifyStrategy, List<String> notifyChannels) {
        if (notifyStrategy == null || "none".equals(notifyStrategy) || notifyChannels == null || notifyChannels.isEmpty()) {
            return;
        }

        String status = report.getStatus();
        String aiAnalysis = report.getAiAnalysis();

        boolean shouldNotify = switch (notifyStrategy) {
            case "always" -> true;
            case "on_alert" -> isAlertDetected(aiAnalysis);
            case "on_failure" -> "failed".equals(status);
            case "ai_decide" -> askAiIfShouldNotify(aiAnalysis, task.getNotifyAiPrompt());
            default -> false;
        };

        if (!shouldNotify) {
            log.debug("Notification skipped for task [{}], strategy={}, status={}", task.getName(), notifyStrategy, status);
            return;
        }

        String message = formatNotification(task, report);
        log.info("Sending notification for task [{}] to channels: {}", task.getName(), notifyChannels);
        channelMessageRouter.pushToChannelsAsync(notifyChannels, message);
    }

    /**
     * 格式化通知消息。
     */
    private String formatNotification(AiScheduledTask task, AiInspectReport report) {
        String status = report.getStatus();
        String emoji = switch (status) {
            case "success" -> "✅";
            case "failed" -> "❌";
            default -> "ℹ️";
        };

        boolean hasAlert = isAlertDetected(report.getAiAnalysis());
        if (hasAlert && "success".equals(status)) {
            emoji = "⚠️";
        }

        StringBuilder sb = new StringBuilder();
        sb.append(emoji).append(" Scheduled Task / 定时任务通知\n");
        sb.append("━━━━━━━━━━━━━━━━━━\n");
        sb.append("📋 Task / 任务: ").append(task.getName()).append("\n");
        sb.append("🕐 Time / 时间: ").append(LocalDateTime.now().format(DT_FMT)).append("\n");
        sb.append("📊 Status / 状态: ").append(translateStatus(status));
        if (hasAlert) {
            sb.append(" (Alert Detected / 发现告警)");
        }
        sb.append("\n");

        if (report.getAiAnalysis() != null && !report.getAiAnalysis().isBlank()) {
            sb.append("\n📝 AI Analysis / AI 分析摘要:\n");
            String analysis = report.getAiAnalysis();
            if (analysis.length() > MAX_ANALYSIS_LENGTH) {
                analysis = analysis.substring(0, MAX_ANALYSIS_LENGTH) + "\n...(Truncated / 已截断)";
            }
            sb.append(analysis);
        } else if (report.getScriptOutput() != null && !report.getScriptOutput().isBlank()) {
            sb.append("\n📄 Output / 执行输出摘要:\n");
            String output = report.getScriptOutput();
            if (output.length() > MAX_ANALYSIS_LENGTH) {
                output = output.substring(0, MAX_ANALYSIS_LENGTH) + "\n...(Truncated / 已截断)";
            }
            sb.append(output);
        }

        sb.append("\n\n💬 Reply to inquire AI about this report / 回复此消息可继续向 AI 询问本次报告详情");
        return sb.toString();
    }

    /**
     * 检测 AI 分析结果中是否包含告警关键词。
     * 复用 AiSchedulerService.checkAndAlertCriticalFindings 中的关键词列表。
     */
    private boolean isAlertDetected(String aiAnalysis) {
        if (aiAnalysis == null || aiAnalysis.isBlank()) return false;
        String lower = aiAnalysis.toLowerCase();
        return ALERT_KEYWORDS.stream().anyMatch(lower::contains);
    }

    /**
     * 调用 AI 判断当前分析结果是否需要发送通知。
     */
    private boolean askAiIfShouldNotify(String aiAnalysis, String userNotifyPrompt) {
        if (aiAnalysis == null || aiAnalysis.isBlank()) return false;
        try {
            ChatModel chatModel = chatModelFactory.getChatModel(null);
            StringBuilder sb = new StringBuilder();
            sb.append("You are a server monitoring assistant. Based on the following AI analysis report of a scheduled server inspection, ")
                    .append("decide whether this report contains anything important enough to warrant sending a notification to the operations team. ")
                    .append("Consider: critical errors, security risks, resource exhaustion, service failures, or any anomalies that need human attention. ")
                    .append("Normal healthy status reports do NOT need notification.\n");
            if (userNotifyPrompt != null && !userNotifyPrompt.isBlank()) {
                sb.append("\nAdditional user-defined notification criteria:\n").append(userNotifyPrompt).append("\n");
            }
            sb.append("\nReply with ONLY 'YES' or 'NO'.\n\n")
                    .append("Analysis Report:\n").append(aiAnalysis.length() > 2000 ? aiAnalysis.substring(0, 2000) : aiAnalysis);
            String prompt = sb.toString();
            var future = CompletableFuture.supplyAsync(() -> {
                var response = chatModel.call(new Prompt(prompt));
                return response.getResult().getOutput().getText();
            });
            String result = future.get(60, TimeUnit.SECONDS);
            boolean shouldNotify = result != null && result.trim().toUpperCase().startsWith("YES");
            log.info("AI notification decision: {} (raw response: {})", shouldNotify ? "NOTIFY" : "SKIP",
                    result != null ? result.trim().substring(0, Math.min(result.trim().length(), 50)) : "null");
            return shouldNotify;
        } catch (Exception e) {
            log.error("AI notification decision failed, defaulting to notify: {}", e.getMessage());
            return true;
        }
    }

    private String translateStatus(String status) {
        return switch (status) {
            case "success" -> "Success / 成功";
            case "failed" -> "Failed / 失败";
            case "running" -> "Running / 执行中";
            default -> status;
        };
    }

    private static final Set<String> ALERT_KEYWORDS = Set.of(
            "严重", "危险", "紧急", "critical",
            "异常", "告警", "磁盘空间不足", "内存不足",
            "cpu 使用率过高", "安全风险",
            "error", "warning", "alert", "fatal",
            "failure", "failed", "timeout", "unreachable",
            "out of memory", "oom", "disk full", "no space left",
            "high risk", "vulnerability", "unauthorized",
            "connection refused", "service down", "not responding"
    );
}
