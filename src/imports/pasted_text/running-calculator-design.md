Промт для дизайна калькулятора бега в Figma
Роль: Ты — эксперт в UI/UX дизайне, специализирующийся на создании чистых, современных и высококонверсионных интерфейсов в Figma, с глубоким пониманием принципов адаптивной верстки (Responsive Design) и системы Figma Auto Layout.

Задача: Разработать концепт дизайна адаптивного калькулятора темпа бега (Running Pace Calculator) для Figma на основе предоставленной мной HTML/CSS структуры. Твоя цель — улучшить визуальную эстетику, юзабилити и подготовить макет к легкой передаче в разработку.

Входные данные (мой текущий код):
HTML:
html<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Умный беговой калькулятор</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🏃‍♂️ Running Calc</h1>
        
        <div class="mode-switch">
            <button id="btn-mode-pace" class="active" onclick="setMode('pace')">Найти темп</button>
            <button id="btn-mode-time" onclick="setMode('time')">Найти время</button>
        </div>

        <div class="input-group">
            <label for="distance">Дистанция (метры):</label>
            <input type="number" id="distance" step="1" placeholder="Например, 1000">
        </div>

        <div id="time-input-block" class="input-group">
            <label>Время:</label>
            <div class="time-inputs">
                <input type="number" id="hours" placeholder="Ч" min="0">
                <input type="number" id="minutes" placeholder="М" min="0">
                <input type="number" id="seconds" placeholder="С" min="0">
            </div>
        </div>

        <div id="pace-input-block" class="input-group hidden">
            <label>Темп (мин/км):</label>
            <div class="time-inputs">
                <input type="number" id="pace-min" placeholder="Мин">
                <input type="number" id="pace-sec" placeholder="Сек">
            </div>
        </div>

        <button onclick="calculate()" class="calc-btn">Рассчитать</button>

        <div id="result" class="result"></div>
    </div>

    <script src="script.js"></script>
</body>
</html>





CSS:
ody {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    color: #333;
}
.container {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    width: 340px;
    text-align: center;
}
h1 { margin-top: 0; font-size: 1.5rem; color: #2c3e50; }

.mode-switch {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 1.5rem;
    background: #eee;
    padding: 5px;
    border-radius: 8px;
}
.mode-switch button {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: 0.3s;
}
.mode-switch button.active {
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    color: #007bff;
}

.input-group { margin-bottom: 1.2rem; text-align: left; }
label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.9rem; }
input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
    outline: none;
}
input:focus { border-color: #007bff; }
.time-inputs { display: flex; gap: 8px; }

.hidden { display: none; }

.calc-btn {
    width: 100%;
    padding: 14px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}
.calc-btn:hover { background-color: #0056b3; }

.result {
    margin-top: 1.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: #28a745;
    min-height: 1.5em;
}
.error { color: #dc3545; font-size: 0.9rem; }

/* Стили для списка отсечек */
.splits-container {
    margin-top: 15px;
    text-align: left;
    font-size: 0.95rem;
    color: #333;
}
.splits-container strong {
    display: block;
    margin-bottom: 8px;
    color: #555;
}
.splits-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}
.splits-list li {
    display: flex;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid #eee;
    background-color: #fff;
}
.splits-list li:last-child {
    border-bottom: none;
}
.splits-list li:nth-child(even) {
    background-color: #f9f9f9;
}
.splits-list li.final-split {
    background-color: #e8f4fd;
    color: #0056b3;
    font-weight: bold;
    border-top: 2px solid #007bff;
}
.split-time {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
}




Требования к дизайну в Figma:
1. Анализ кода: Проанализируй предоставленный HTML/CSS. Определи основные логические блоки (поля ввода дистанции, времени, целевого темпа, кнопка расчета, блок вывода результата). Сохрани эту логику, но предложи более современное визуальное представление.
2. Адаптивность (Responsive): Опиши или сгенерируй макет для трех контрольных точек (breakpoints):
    * Desktop (1440px): Например, форма и результаты могут быть расположены в две колонки или в виде просторной карточки по центру.
    * Tablet (768px): Оптимизация отступов, возможно, вертикальное расположение блоков.
    * Mobile (375px): Одноколоночный layout, крупные тач-таргеты (минимум 44x44px) для полей ввода и кнопок, удобная мобильная клавиатура (подразумевается).
3. Система Auto Layout: Укажи, как должны быть настроены фреймы (например, направление Vertical с Gap: 16px, выравнивание Fill для инпутов).
4. Состояния компонентов (Variants): Для ключевых элементов (Input, Button) опиши состояния:
    * Default (по умолчанию)
    * Hover (наведение)
    * Focus (активное поле ввода, с акцентной обводкой)
    * Error (неверный формат данных, например, красная обводка и текст подсказки)
    * Disabled (неактивная кнопка до заполнения полей)
5. Визуальный стиль:
    * Типографика: Используй чистый шрифт без засечек (Inter, Roboto или SF Pro). Для цифр (время, темп) настоятельно рекомендую использовать моноширинный шрифт или табличные цифры (tabular nums) для предотвращения "прыгания" значений при пересчете.
    * Цвета: Спортивная, энергичная, но не агрессивная палитра. Например, темно-синий или графитовый фон/текст с ярким акцентным цветом (неоново-зеленый, оранжевый или электрический синий) для кнопки "Рассчитать" и активных элементов.
    * Доступность (Accessibility): Обеспечь контраст текста и фона не менее 4.5:1. Добавь видимые лейблы (не только placeholder'ы).

