// click.js
// Выделение НИКОГДА не пропадает при сворачивании

document.addEventListener('DOMContentLoaded', function() {
    
    // Хранилище выделенных подпунктов (ключ = id чекбокса)
    var selectedItems = {};
    
    // Функция сохранения выделения в localStorage (чтобы не терялось при обновлении)
    function saveToLocalStorage() {
        localStorage.setItem('selectedSubItems', JSON.stringify(selectedItems));
    }
    
    // Функция загрузки из localStorage
    function loadFromLocalStorage() {
        var saved = localStorage.getItem('selectedSubItems');
        if (saved) {
            selectedItems = JSON.parse(saved);
        }
    }
    
    // Функция обновления визуального выделения
    function updateAllSelections() {
        var allWrappers = document.querySelectorAll('.item-wrapper, .dropdown-item-wrapper');
        
        for (var w = 0; w < allWrappers.length; w++) {
            var wrapper = allWrappers[w];
            var checkbox = wrapper.querySelector('.dropdown-checkbox');
            if (!checkbox) continue;
            
            var checkboxId = checkbox.id;
            var savedText = selectedItems[checkboxId];
            
            if (savedText) {
                var items = wrapper.querySelectorAll('.sub-item');
                for (var i = 0; i < items.length; i++) {
                    var span = items[i].querySelector('span');
                    var itemText = span ? span.innerText : items[i].innerText;
                    if (itemText === savedText) {
                        items[i].classList.add('selected');
                    } else {
                        items[i].classList.remove('selected');
                    }
                }
            }
        }
    }
    
    // Загружаем сохранённые выделения
    loadFromLocalStorage();
    
    // ===== ОБРАБОТКА КЛИКОВ ПО sub-item =====
    var allSubItems = document.querySelectorAll('.sub-item');
    
    for (var i = 0; i < allSubItems.length; i++) {
        allSubItems[i].addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Находим родительский wrapper
            var wrapper = this.closest('.item-wrapper');
            if (!wrapper) wrapper = this.closest('.dropdown-item-wrapper');
            if (!wrapper) return;
            
            // Находим чекбокс
            var checkbox = wrapper.querySelector('.dropdown-checkbox');
            if (!checkbox) return;
            
            var checkboxId = checkbox.id;
            if (!checkboxId) return;
            
            // Получаем текст
            var span = this.querySelector('span');
            var selectedText = span ? span.innerText : this.innerText;
            
            // Переключаем выделение
            if (selectedItems[checkboxId] === selectedText) {
                // Снимаем выделение
                delete selectedItems[checkboxId];
                this.classList.remove('selected');
            } else {
                // Выделяем новый
                selectedItems[checkboxId] = selectedText;
                
                // Обновляем все подпункты в этом wrapper
                var siblings = wrapper.querySelectorAll('.sub-item');
                for (var j = 0; j < siblings.length; j++) {
                    var sSpan = siblings[j].querySelector('span');
                    var sText = sSpan ? sSpan.innerText : siblings[j].innerText;
                    if (sText === selectedText) {
                        siblings[j].classList.add('selected');
                    } else {
                        siblings[j].classList.remove('selected');
                    }
                }
            }
            
            // Сохраняем
            saveToLocalStorage();
        });
    }
    
    // Обновляем выделение при загрузке
    updateAllSelections();
    
    // Не удаляем выделение при сворачивании - вообще никак не реагируем на change
    // Всё уже сохранено в selectedItems
    
});