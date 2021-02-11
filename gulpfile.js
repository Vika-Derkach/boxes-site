// Определяем переменную "preprocessor"
let preprocessor = 'sass'; 
 
// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');
 
// Подключаем Browsersync
const browserSync = require('browser-sync').create();
 
// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass');
 
// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');
 
 
// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'src/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}
 
function styles() {
	return src('src/' + preprocessor + '/style.' + preprocessor + '') // Выбираем источник: "src/sass/main.sass" или "src/less/main.less"
	.pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
	.pipe(dest('src/css/')) // Выгрузим результат в папку "src/css/"
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}
 
 
function buildcopy() {
	return src([ // Выбираем нужные файлы
		'src/css/**/*.min.css',
		'src/js/**/*.min.js',
		'src/images/dest/**/*',
		'src/**/*.html',
		], { base: 'src' }) // Параметр "base" сохраняет структуру проекта при копировании
	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}
 
function cleandist() {
	return del('dist/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
}
 
function startwatch() {
	
	// Мониторим файлы препроцессора на изменения
	watch('src/**/' + preprocessor + '/**/*', styles);
 
	// Мониторим файлы HTML на изменения
	watch('src/**/*.html').on('change', browserSync.reload);
}
 
// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;
 
// Экспортируем функцию styles() в таск styles
exports.styles = styles;
 
// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, styles,  buildcopy);
 
// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, browsersync, startwatch);