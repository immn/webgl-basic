// Функция инициализации скрипта
var InitWebGL = function() {
	var VSText, FSText;

	// Загружаем вершинный шейдер
	loadTextResource('/shaders/vertexShader.glsl')
	.then(function(result) {
		VSText = result;
		return loadTextResource('/shaders/fragmentShader.glsl');
	})
	.then(function(result){
		FSText = result;
		return StartWebGL(VSText, FSText);
	})
	.catch(function(error) {
		alert('Error with loading resources. See console.');
		console.error(error);
	})
}

// Объявление глобальных переменных
var gl, program, vertexArray = [];

var StartWebGL = function (vertexShaderText, fragmentShaderText) {
	var canvas = document.getElementById('example-canvas');
	gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL');
		return;
	}

	canvas.height = gl.canvas.clientHeight;
	canvas.width = gl.canvas.clientWidth;

	canvas.addEventListener('mousedown', function(event){
		onmousedown(event, canvas);
	})

	// Задаем размер вьюпорта (области отрисовки)
	gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);

	program = createProgram(gl, vertexShader, fragmentShader);
	
	draw();

};

var draw = function(){

	var vertexBuffer = gl.createBuffer();

	// Задаем точку связывания (наш буфер будет содержать вершинные атрибуты)
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

	// Создаем атрибут вершинного шейдера
	var positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');

	// Определяем кол-во вершин, которые необходимо отрисовать
	var vertices_number = vertexArray.length / 2;

	gl.vertexAttribPointer(
		positionAttribLocation, // ссылка на атрибут
		2, // кол-во элементов на 1 итерацию
		gl.FLOAT, // тип данных
		gl.FALSE, // нормализация
		2 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
		0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
	);

	gl.enableVertexAttribArray(positionAttribLocation);

	// Задаем цвет заднего фона
	gl.clearColor(0.75, 0.9, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, vertices_number);
	gl.drawArrays(gl.POINTS, 0, vertices_number);
}


function onmousedown(event, canvas){

	var x = event.clientX;
	var y = event.clientY;

	var middle_X = gl.canvas.width / 2;
	var middle_Y = gl.canvas.height / 2;

	var rect = canvas.getBoundingClientRect();

	x = ((x - rect.left) - middle_X) / middle_X;
	y = (middle_Y - (y - rect.top)) / middle_Y;

	vertexArray.push(x);
	vertexArray.push(y);

	draw();
}


document.addEventListener('DOMContentLoaded', function() {
	InitWebGL();
});