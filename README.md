# voxwebgpu
A lightweight WebGPU computing and 2d/3d rendering system

Features:

   1. 用户态与系统态隔离。

   2. 高频调用与低频调用隔离。

   3. 面向用户的易用性封装，保证易用性与灵活性。

   4. 渲染数据(内外部相关资源)和渲染机制分离。

   5. 用户操作和渲染系统调度并行机制。

   6. 保持稀疏松散的架构形态，数据/语义驱动。

   7. 异步并行的场景/模型载入。

   8. 保持computing与rendering机制一致性。
         1). 构造过程一致性。
         2). 使用过程一致性。
         3). 自动兼容到materialmulti-pass、material graph、pass graph机制中。


Installation and running:

   第一步，全局安装git[ https://git-scm.com/downloads ]。
   step 1, install global git[ https://git-scm.com/downloads ].

   第二步，全局安装nodejs(建议大版本为16)[ https://nodejs.org/download/release/v16.20.2/ ], 默认自动安装npm。
   step 2, install global nodejs(The recommended major version is 16)[ https://nodejs.org/download/release/v16.20.2/ ], auto include npm already.

   第三步，全局安装yarn，在你的系统命令终端执行 npm install -g yarn 命令即可。
   step 3, install global yarn(run the "npm install -g yarn" command in your os terminal)

   第四步，下载 Visual Studio Code[ https://code.visualstudio.com/Download ]，安装。
   step 4, download Visual Studio Code[ https://code.visualstudio.com/Download ], install it.

   第五步，打开Visual Studio Code程序，然后点击 File 菜单。接着点击 Add Folder to Workerspace 选项, 选择并打开 voxweb3d 文件夹
   step 5, run the Visual Studio Code, then click the File menu. Next, click "Add Folder to Workerspace" item, select and open the voxweb3d folder.

   第六步，在当前工作空间的集成终端。
   step 6, open the integrated terminal in the current workspace.

   第七步，在集成终端中进入 voxweb3d 目录，在此终端中运行 "yarn install"命令，等待一会儿。如果报错，请看：https://blog.csdn.net/vily_lei/article/details/108725829
   step 7, enter the voxweb3d dir from the integrated terminal, and run the "yarn install" command in this terminal. Wait a few minutes.
   if you see some errors, look this link: https://blog.csdn.net/vily_lei/article/details/108725829
    
   第八步，在终端中运行 "yarn dev:vox" 命令，你就能在浏览器上看到相应的WebGPU 3D程序。
   step 8, run the "yarn dev" command, you will see a WEbGPU 3D display in your browser.
   
   第九步，在终端中运行 "yarn build" 命令打包js代码。
   step 9, run the "yarn build" command, it can build relevant js package.

other infomation:

    1. You can find some demos in the src/main.ts file.
