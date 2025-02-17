// 在 Worker 中接收 OffscreenCanvas
self.onmessage = function(event) {

    console.log("worker exec...", event);
    let pdata = event.data;
    if(pdata.exec == 'draw') {
        console.log("worker draw ...");
        let width = 256;
        let height = 256;
        const offscreen = new OffscreenCanvas(width, height);
        const gl = offscreen.getContext("webgl");
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        // Set the clear color to darkish green.
        gl.clearColor(0.0, 0.5, 0.0, 1.0);
        // Clear the context with the newly set color. This is
        // the function call that actually does the drawing.
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Perform some drawing using the gl context
    
        let img = offscreen.transferToImageBitmap();
        
        self.postMessage({ image: img }, [img]);
        // 绘制完成后，发送消息回主线程
        self.postMessage('drawing end.');
    }
};
