var myCanvas = function(e){
	this.obj = null;
	this.objHasPic = null;
	this.myJson = {};
	this.x;
	this.y;
	this.startX = 0;
	this.startY = 0;
	this.moveX = 0;
	this.moveY = 0;
	this.posX = 0;
	this.posY = 0;
	this.jsX = 0;
	this.jsY = 0;
	this.ifMove = true;
	this.getBtn = null;
	this.getBox = null;
	this.imgUrl = null;
	this.getUrl = null;
	this.obj2 = null;
	this.useragent = null;
	this.reader = new FileReader();
	e && this.init(e);
};
myCanvas.prototype = {
	init:function(e){
		if(!e){return false;}
		this.obj = 'string' == (typeof e.id) ? document.getElementById(e.id) : e.id;
		this.objHasPic = 'string' == (typeof e.picId) ? document.getElementById(e.picId) : e.picId;
		this.myJson = this.setJson();
		this.getBtn = 'string' == (typeof e.btn) ? document.getElementById(e.btn) : e.btn;
		this.getBox = 'string' == (typeof e.imgBox) ? document.getElementById(e.imgBox) : e.imgBox;
		this.cameraInput = 'string' == (typeof e.cameraInput) ? document.getElementById(e.cameraInput) : e.cameraInput;
		this.myJson = e.myJson;
		this.obj2 = 'string' == (typeof e.id2) ? document.getElementById(e.id2) : e.id2;
		this.run();
	},
	setJson:function(){

	},
	run:function(){
		var that = this;
		var ctx = this.obj.getContext('2d');
		ctx.fillStyle="rgba(0,0,0,0.5)";
		ctx.fillRect(0,0,414,414);
		this.aEvent(that.cameraInput,'change',function(e){
			e = e || window.event;
			var files = e.target.files; 
		    var f = files[0];
			that.drawOnCanvas(f,0,0);

			that.aEvent(that.obj,'mousedown',function(e){
				that.actStart(e);
			});
			that.aEvent(document,'mousemove',function(e){
				that.actMove(e);
			});
			that.aEvent(document,'mouseup',function(e){
				that.actEnd(e);
			});

			that.aEvent(that.obj,'touchstart',function(e){
				that.actStart(e);
			});
			that.aEvent(document,'touchmove',function(e){
				that.actMove(e);
			});
			that.aEvent(document,'touchend',function(e){
				that.actEnd(e);
			});
		});
		this.getImg(this.getBtn ,this.getBox);
	},
	drawOnCanvas:function(file,offsetX,offsetY) {
		var that = this;
		var reader = new FileReader();
		reader.onload = function (e) {
			e = e || window.event;
			that.imgUrl = e.target.result;
			that.drawImg(offsetX,offsetY);
		}; 
		reader.readAsDataURL(file);
	},
	drawImg:function(x,y){
		var that = this;
		var ctx = this.obj.getContext('2d'),
		img = new Image();
		this.aEvent(img,'load',function(){
			that.clearCanvas(that.obj);
			if(this.width > this.height){
				that.myJson.imgWidth = Math.round(that.myJson.canWidth * this.width / this.height);
				that.myJson.imgHeight = that.myJson.canHeight;
				y = that.y = 0;
			}else{
				that.myJson.imgHeight = Math.round(that.myJson.canHeight * this.height / this.width);
				that.myJson.imgWidth = that.myJson.canHeight;
				x = that.x = 0;
			}
			//console.log(that.myJson.imageWidth);
			ctx.drawImage(this,x,y,that.myJson.imgWidth,that.myJson.imgHeight);
			//fn && fn();
		});
		img.src = this.imgUrl;
	},
	getImg:function(e,t){
		//e = e || window.event;
		var that = this;
		this.aEvent(e,'click',function(){
			that.getUrl = that.obj.toDataURL();
			t.src = that.getUrl;
		});
	},
	actStart:function(e){
		e = e || window.event;
		e.preventDefault();
		
		this.ifMove = true;
		this.startX = (e.clientX ? e.clientX : e.touches[0].pageX);
		this.startY = (e.clientY ? e.clientY : e.touches[0].pageY);
		e.stopPropagation();	
		return false;
	},
	actMove:function(e){
		e = e || window.event;
		e.preventDefault();
		if(this.ifMove != true){return false;}
		this.moveX = (e.clientX ? e.clientX : e.touches[0].pageX)-this.startX+this.posX;
		this.moveY = (e.clientY ? e.clientY : e.touches[0].pageY)-this.startY+this.posY;
		if(this.moveX > 0){
			this.moveX = 0;
		}else if(this.moveX < this.myJson.imgWidth * -1 + this.myJson.canWidth){
			this.moveX = this.myJson.imgWidth * -1 + this.myJson.canWidth;
		}
		if(this.moveY > 0){
			this.moveY = 0;
		}else if(this.moveY < this.myJson.imgHeight * -1 + this.myJson.canHeight){
			this.moveY = this.myJson.imgHeight * -1 + this.myJson.canHeight;
		}
		//console.log(e.offsetX);
		this.drawImg(this.moveX,this.moveY,this.imgUrl);	
		this.jsX=this.moveX;
		this.jsY=this.moveY;
		e.stopPropagation();
	},
	actEnd:function(e){
		e.preventDefault();
		document.onmousemove = null;
		this.ifMove = false;
		this.posX=this.jsX;
		this.posY=this.jsY;
		e.stopPropagation();
		return false;
	},
	clearCanvas:function(e){
		var ctx = e.getContext('2d');
		ctx.clearRect(0,0,e.width,e.height);
	},
	aEvent:function(e,type,fn){
		//e = e || window.event;
		if(e.addEventListener){
			e.addEventListener(type,fn,false);
		}else if(e.attachEvent){
			e.attachEvent("on" + type,fn);
		}else{
			e["on" + type] = fn;
		}
	}
};
window.onload = function(){
	var myCanvas1 = new myCanvas({
		id : document.getElementById('myCanvas'),
		id2 : document.getElementById('canvas'),
		btn : document.getElementById('getMypic'),
		imgBox : document.getElementById('getMyUrl'),
		cameraInput : document.getElementById('cameraInput'),
		myJson : {
			canWidth : 414,
			canHeight : 414,
			imgWidth : 0,
			imgHeight : 0
		}
	});
};