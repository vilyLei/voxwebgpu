// 在 Worker 中接收 OffscreenCanvas
self.onmessage = function(event) {
    const offscreenCanvas = event.data.canvas;

    // 获取 OffscreenCanvas 上下文
    const ctx = offscreenCanvas.getContext('2d');

    // 在子线程中绘制
    ctx.fillStyle = 'green';
    ctx.fillRect(50, 50, 200, 200);
    
    // 绘制完成后，发送消息回主线程
    self.postMessage('绘制完成');
};
