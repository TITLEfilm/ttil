// ===== КАСТОМНЫЙ КУРСОР (ФИНАЛЬНАЯ ВЕРСИЯ) =====
(function() {
    
    // Проверяем, был ли уже создан курсор
    if (window.customCursorInitialized) {
        return;
    }
    window.customCursorInitialized = true;
    
    // Создаём курсор
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var isOnAnimated = false;
    
    // Восстанавливаем позицию с прошлой страницы
    var lastMouseX = sessionStorage.getItem('cursorX');
    var lastMouseY = sessionStorage.getItem('cursorY');
    
    if (lastMouseX && lastMouseY) {
        mouseX = parseFloat(lastMouseX);
        mouseY = parseFloat(lastMouseY);
        cursorX = mouseX;
        cursorY = mouseY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    }
    
    // Сохраняем позицию перед уходом
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('cursorX', mouseX);
        sessionStorage.setItem('cursorY', mouseY);
    });
    
    // Скрываем стандартные курсоры
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';
    
    function removeAllCursors() {
        var allElements = document.querySelectorAll('*');
        for (var i = 0; i < allElements.length; i++) {
            if (allElements[i].style.cursor !== 'none') {
                allElements[i].style.cursor = 'none';
            }
        }
        var headerAll = document.querySelectorAll('header, header *');
        for (var j = 0; j < headerAll.length; j++) {
            headerAll[j].style.cursor = 'none';
        }
    }
    
    // Движение мыши
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        sessionStorage.setItem('cursorX', mouseX);
        sessionStorage.setItem('cursorY', mouseY);
    });
    
    // Плавное движение
    function updateCursor() {
        var dx = mouseX - cursorX;
        var dy = mouseY - cursorY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var speed = distance > 100 ? 0.5 : 0.25;
        
        cursorX += dx * speed;
        cursorY += dy * speed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    removeAllCursors();
    
    // Следим за новыми элементами
    var observer = new MutationObserver(function() {
        removeAllCursors();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    
    // ===== ПРОВЕРКА CSS-АНИМАЦИИ =====
    function hasCssAnimation(el) {
        if (!el) return false;
        
        var styles = window.getComputedStyle(el);
        
        // Проверка transition
        var transition = styles.transitionProperty;
        if (transition && transition !== 'none' && transition !== 'all') return true;
        
        // Проверка animation
        var animation = styles.animationName;
        if (animation && animation !== 'none') return true;
        
        // Проверка inline стилей
        var inlineStyle = el.getAttribute('style') || '';
        if (inlineStyle.indexOf('transition') !== -1) return true;
        if (inlineStyle.indexOf('animation') !== -1) return true;
        
        // Проверка классов с анимацией
        var classNames = el.className || '';
        if (typeof classNames === 'string') {
            var animationClasses = [
                'hover', 'animated', 'transition', 'animate', 'moving', 
                'shifting', 'fade', 'slide', 'scale', 'rotate', 'pulse', 
                'bounce', 'social', 'icon', 'footer', 'gradient', 'shadow',
                'photo'  // ← с маленькой буквы
            ];
            for (var i = 0; i < animationClasses.length; i++) {
                if (classNames.indexOf(animationClasses[i]) !== -1) return true;
            }
        }
        
        return false;
    }
    
    // ===== ЭЛЕМЕНТЫ, КОТОРЫЕ АКТИВИРУЮТ ЗЕЛЁНЫЙ КУРСОР =====
    function shouldActivateCursor(el) {
        if (!el) return false;
        
        // Исключаем текстовые блоки и элементы, которые НЕ должны активировать курсор
        var excludeSelectors = [
            '.left-container', '.right-container', '.footer-text',
            '.purple-block-text', '.green-block-text', '.description-text',
            'p:not(.overlay-text)', 'h1', 'h2', 'h3', 'h4',
            // ===== УБИРАЕМ АНИМАЦИЮ С ЭТИХ КЛАССОВ =====
            '.images-row',
            '.images-row *',
            '.image-item',
            '.image-item *',
            '.purple-box2',
            '.purple-box2 *'
        ];
        
        for (var i = 0; i < excludeSelectors.length; i++) {
            if (el.matches && el.matches(excludeSelectors[i])) return false;
            if (el.parentElement && el.parentElement.matches && el.parentElement.matches(excludeSelectors[i])) return false;
        }
        
        // Явные селекторы
        var includeSelectors = [
            '.white-rectangle', '.white-rectangle2',
            '.image-portrait-1', '.image-portrait-2', '.image-portrait-3',
            '.shadow-1', '.shadow-2', '.main-image', '.rect-image',
            '.dropdown-item', '.sub-item', '.social-icon',
            '.button', '.search-input', '.gradient-overlay',
            '.shapka1 .button a', '.shapka2 .button a', '.shapka4 .button2 img',
            'a', 'button', 'input', '[onclick]', '.overlay-text',
            'footer a', 'footer .social-icon', 'footer .footer-text',
            '.social-item', '.footer-block',
            // ===== ДОБАВЛЯЕМ АНИМАЦИЮ ДЛЯ ЭТОГО КЛАССА (с маленькой буквы) =====
            '.photo',
            '.photo *'
        ];
        
        for (var j = 0; j < includeSelectors.length; j++) {
            if (el.matches && el.matches(includeSelectors[j])) return true;
            if (el.parentElement && el.parentElement.matches && el.parentElement.matches(includeSelectors[j])) return true;
        }
        
        // ГЛАВНОЕ: ПРОВЕРКА НА CSS-АНИМАЦИЮ
        if (hasCssAnimation(el)) return true;
        
        // Проверка родителя (до 3 уровней)
        var parent = el.parentElement;
        var depth = 0;
        while (parent && depth < 3) {
            if (hasCssAnimation(parent)) return true;
            parent = parent.parentElement;
            depth++;
        }
        
        return false;
    }
    
    // ===== ОБРАБОТЧИКИ =====
    document.addEventListener('mouseover', function(e) {
        var target = e.target;
        
        if (shouldActivateCursor(target)) {
            if (!isOnAnimated) {
                isOnAnimated = true;
                cursor.classList.add('hover');
            }
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        var relatedTarget = e.relatedTarget;
        
        if (relatedTarget && shouldActivateCursor(relatedTarget)) {
            return;
        }
        
        if (relatedTarget && relatedTarget.parentElement && shouldActivateCursor(relatedTarget.parentElement)) {
            return;
        }
        
        if (isOnAnimated) {
            isOnAnimated = false;
            cursor.classList.remove('hover');
        }
    });
    
    document.addEventListener('mouseleave', function() {
        if (isOnAnimated) {
            isOnAnimated = false;
            cursor.classList.remove('hover');
        }
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
    
    setTimeout(function() {
        cursor.style.opacity = '1';
    }, 100);
    
})();// ===== КАСТОМНЫЙ КУРСОР (СТАБИЛЬНАЯ ВЕРСИЯ) =====
(function() {
    
    // Создаём курсор, если ещё не создан
    if (document.querySelector('.custom-cursor')) return;
    
    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    var mouseX = 0, mouseY = 0;
    var cursorX = 0, cursorY = 0;
    var active = false;
    var rafId = null;
    
    // Получаем позицию мыши
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!active) {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            cursorX = mouseX;
            cursorY = mouseY;
            active = true;
        }
    });
    
    // Плавное движение
    function updateCursor() {
        if (active) {
            cursorX += (mouseX - cursorX) * 0.3;
            cursorY += (mouseY - cursorY) * 0.3;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        }
        rafId = requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // ===== ЭЛЕМЕНТЫ, ПРИ НАВЕДЕНИИ НА КОТОРЫЕ МЕНЯЕТСЯ КУРСОР =====
    var selectors = [
        '.white-rectangle', '.white-rectangle2',
        '.image-portrait-1', '.image-portrait-2', '.image-portrait-3',
        '.shadow-1', '.shadow-2', '.main-image', '.rect-image',
        '.dropdown-item', '.sub-item', '.social-icon',
        '.button', '.search-input', '.purple-box2', '.gradient-overlay',
        '.shapka1 .button a', '.shapka2 .button a', '.shapka4 .button2 img',
        'a', 'button', '.news-card', '.release-card', '.social-item',
        '.card-toggle-label', '.release-movie-title'
    ];
    
    var selector = selectors.join(',');
    
    // Добавляем обработчики
    function addListeners() {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            if (!el.hasCursorListener) {
                el.hasCursorListener = true;
                el.addEventListener('mouseenter', function() {
                    cursor.classList.add('hover');
                });
                el.addEventListener('mouseleave', function() {
                    cursor.classList.remove('hover');
                });
            }
        }
    }
    
    addListeners();
    
    // Следим за новыми элементами
    var observer = new MutationObserver(function() {
        addListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // При уходе с окна — скрываем
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
    
})();