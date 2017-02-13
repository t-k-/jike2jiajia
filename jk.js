var fall_x = 1;
var num_words_shown = 0;
var magic_balls = [];
var magic_ceils = [];
/*
*/
var words_arr = [
"昨天想了半天不知道该怎么代表月亮问候一下你<br/>",
"于是还是老套地把科科拖出来了，因为至少他会让你开心<br/>",
"虽然他还是一脸无奈并且萌呆的表情，但那只是睡眠不足<br/>",
"他看起来很沉默吧？那因为很多时候他挑不出满意的话语<br/>",
"但是，他始终不想让你失望，所以至少可以发挥特长做点什么吧！",
"嘿嘿嘿。。 （羞羞，逃跑。。。"
];

function add_ceils(x, y, len) {
	for (var i = 0; i < len; i ++) {
		var c = new Magicceil((x + i) * 12, y * 12);
		magic_ceils.push(c);
	}
}

function prepare_ceils() {
	var h = 0;
	add_ceils(12, h++, 1);
	add_ceils(12, h++, 1);
	add_ceils(9, h++, 7);
	add_ceils(12, h++, 1);
	add_ceils(10, h++, 5);
	h++;
	add_ceils(10, h++, 5);
	add_ceils(10, h, 1); add_ceils(14, h, 1); h++;
	add_ceils(10, h++, 5);
	//h++;
	add_ceils(8, h, 2); add_ceils(15, h, 2); h++;
	add_ceils(6, h++, 13);
	//h++;
	add_ceils(9, h++, 1); 
	//h++;
	add_ceils(7, h, 5); add_ceils(14, h, 4); h++;
	//h++;
	add_ceils(9, h, 1); add_ceils(11, h, 1);
	add_ceils(14, h, 1); add_ceils(17, h, 1); h++;
	//h++;
	add_ceils(8, h, 1); add_ceils(11, h, 1);
	add_ceils(14, h, 1); add_ceils(17, h, 1); h++;
	//h++;
	add_ceils(7, h, 1); add_ceils(11, h, 1);
	add_ceils(14, h, 4); h++;
}

function Magicceil(x, y) {
	var _this = this;
	(function() {
	 _this.x = 60 + x;
	 _this.y = 0 + y;
	 _this.hits = 0;
	 })();

	this.show = function(ctx) {
		if (_this.hits > 0)
			ctx.fillStyle = "#f00";
		else
			ctx.fillStyle = "#fff";
		
		ctx.beginPath();
		ctx.rect(_this.x, _this.y, 10, 10);
		ctx.closePath();

		ctx.fill();
	};

	this.test_hit = function(m, n) {
		if (Math.abs(m - _this.x) <= 10 &&
		    Math.abs(n - _this.y) <= 10)
			return true;
		else
			return false;
	};
	this.add_hit = function() {
		_this.hits ++;
	};
	this.num_hit = function() {
		return _this.hits;
	};
	this.getx = function() {
		return _this.x;
	};
	this.gety = function() {
		return _this.y;
	};
}

var ctx = document.getElementById('canvas').getContext("2d");
ctx.font = "15px Arial";

var jike = new Image();
jike.src = "jk.jpg";

jike.onload = function () {
	prepare_ceils();
	setInterval(gameloop, 100);	
};

function drawPP(ctx, x, y) {
	ctx.fillStyle = '#ffcc66';
	ctx.beginPath();
	ctx.arc(x, y, 5, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fill();
}

function drawHRT(ctx, x, y) {
	ctx.fillStyle = "#f77";
	ctx.fillText("❤", x - 7, y - 5);
}

function Magicball(x, y, toX, toY) {
	var _this = this;
	(function() {
	 _this.x = x;
	 _this.y = y;
	 _this.vx = Math.random() * 10;
	 _this.ay = -17;
	 _this.mod = 'throw';
	 _this.toX = toX;
	 _this.toY = toY;
	 })();

	this.update = function(ctx) {
		if (_this.mod == 'throw') {
			_this.x += _this.vx + Math.random();
			if (_this.ay < 0) {
				_this.y += _this.ay;
			} else {
				/* sink */
				if (_this.ay > 8)
					_this.ay = 8;
				_this.y += _this.ay;

				if (_this.y > 200)
					_this.mod = 'sink';
			}

			_this.ay += 1;
		} else if (_this.mod == 'sink') {
			if (_this.y < _this.toY) {
				_this.y += _this.ay;
			} else {
				_this.y += _this.ay;
				_this.ay = _this.ay / 1.4;
			}
			
			_this.x += _this.vx;
			_this.vx = _this.vx / 1.4;

			if (Math.abs(_this.ay) < 0.5)
				_this.mod = 'lift';
		} else if (_this.mod == 'lift') {
			_this.y -= 1;
			for (var i = 0; i < magic_ceils.length; i++) {
				var c = magic_ceils[i];
				if (c.num_hit() == 0 &&
				    c.test_hit(_this.x, _this.y)) {
					c.add_hit();
					_this.mod = 'hit';
					num_words_shown ++;
				}
			}
		} else /* hit */ {
			;
		}

		if (_this.y > -10 && _this.x < 350) {
			if (_this.mod == 'lift' || _this.mod == 'hit')
				drawHRT(ctx, _this.x, _this.y);
			else
				drawPP(ctx, _this.x, _this.y);
			return 1;
		} else {
			return 0;
		}
	};
};

function rrange(a, b) {
	return (b - a) * Math.random() + a;
}

function gameloop() {
	ctx.clearRect(0, 0, 350, 300);
	ctx.drawImage(jike, 0, 180, 100, 150);
	drawPP(ctx, fall_x, fall_x * fall_x);

	for (var i = 0; i < magic_ceils.length; i++) {
		magic_ceils[i].show(ctx);
	}

	//console.log("words shown: " + num_words_shown);
	var shown_str='';
	var percentage = num_words_shown / magic_ceils.length;
	var toShow = Math.floor(percentage * words_arr.length);
	for (var j = 0; j < toShow; j++) {
		shown_str = shown_str.concat(words_arr[j]);
	}
	console.log("show: " + toShow + '/' + words_arr.length);
	document.getElementById("words").innerHTML = shown_str;

	if (fall_x + 1 < 15)
		fall_x += 1;
	else {
		fall_x = 16.2;
		var x0 = fall_x;
		var y0 = fall_x * fall_x;

		var b = new Magicball(x0, y0, rrange(50, 340),
		                              rrange(200, 290));
		magic_balls.push(b);
		fall_x = 1;
	}

	for (var i = 0; i < magic_balls.length; i++) {
		//console.log('total balls: ' + magic_balls.length);
		if (!magic_balls[i].update(ctx))
			magic_balls.splice(i, 1);
	}
}
