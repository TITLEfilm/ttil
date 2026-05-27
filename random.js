// randomizer.js - Рандомайзер для второго блока (фиксирует размеры картинок)
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== НАБОРЫ ДАННЫХ ДЛЯ РАНДОМАЙЗЕРА =====
    var randomSets = [
        {
            mainImage: 'Картинки 2 /10.png',
            titleText: '«ВОСПОМИНАНИЯ ОБ УБИЙСТВЕ»',
            description: '«Воспоминания об убийстве» — это южнокорейский психологический триллер, основанный на реальных событиях, который погружает зрителя в атмосферу напряжения, недосказанности и внутренней борьбы. Этот фильм отличается особой тонкостью в изображении психологических аспектов и создает уникальную ауру неопределенности, вызывающую размышления о природе преступления, памяти и восприятия истины. История раскрывается через призму расследования серии жестоких преступлений, где каждое новое открытие только усложняет общую картину и заставляет зрителя задаваться вопросами о том, что является реальностью, а что — субъективным восприятием. В центре внимания — человеческая психика, границы морали и поиска справедливости, что делает фильм глубоко философским и психологически насыщенным. Ожидайте медленного, атмосферного погружения, выразительной актерской игры и интересных визуальных образов, которые помогают создать мрачную и загадочную атмосферу. Важной особенностью является тонкое исследование тем памяти, времени и вины, поэтому рекомендуется смотреть фильм внимательно и с полной сосредоточенностью.',
            similarImages: ['Картинки 2 /7.png', 'Картинки 2 /8.png', 'Картинки 2 /9.png']
        },
        {
            mainImage: 'Картинки 2 /50.jpg',
            titleText: '«УБИТЬ БИЛЛА»',
            description: '«Убить Билла» — это масштабный криминальный боевик Квентина Тарантино, разделенный на две части и снятый как дань уважения старым фильмам о боевых искусствах, самурайскому кино и спагетти-вестернам.Сюжет рассказывает о Беатрикс Киддо по прозвищу Чёрная Мамба — бывшей наемнице из элитного отряда убийц. Решив начать мирную жизнь, она уходит от своего босса и любовника Билла, находит жениха и ждет ребенка, однако во время репетиции свадьбы Билл и его подручные жестоко расстреливают всех присутствующих. Беатрикс выживает, проводит четыре года в коме и, очнувшись, заводит список тех, кому должна отомстить. Передвигаясь по всему миру — от США до Японии, — Невеста жестоко и методично уничтожает членов своего бывшего отряда одного за другим, пробиваясь к финальной схватке с самим Биллом.Фильм наполнен стильной хореографией боев, фонтанами крови, культовой музыкой и исследует классическую тему всепоглощающей мести, которая полностью меняет человеческую жизнь.',
            similarImages: ['Картинки 2 /51.jpg', 'Картинки 2 /52.jpg', 'Картинки 2 /53.jpeg']
        },
        {
            mainImage: 'Картинки 2 /60.jpg',
            titleText: '«ШОССЕ В НИКУДА»',
            description: '«Шоссе в никуда» — это загадочный психологический триллер Дэвида Линча, построенный по принципу ленты Мёбиуса, где финал замыкается на начало истории. В центре сюжета находится саксофонист Фред Мэдисон, который подозревает жену в измене, получает странные видеозаписи их дома, а затем оказывается обвинен в ее жестоком убийстве. Находясь в камере смертников, главный герой мистическим образом превращается в совершенно другого человека — молодого автомеханика Пита Дейтона. Пит выходит на свободу, начинает жить своей жизнью и влюбляется в роковую женщину, которая выглядит точь-в-точь как погибшая жена Фреда, что снова затягивает его в порочный круг кошмара.Фильм исследует тему психогенной фуги и отказа от реальности, когда человеческий разум полностью переписывает воспоминания, чтобы защитить себя от осознания совершенного преступления. Зритель видит мир глазами безумца, где пространство и время искажены, персонажи меняют имена, а зловещий Таинственный человек олицетворяет подавленную правду и темную сторону героя. Кинокартина не поддается линейной логике и представляет собой чистый кинематографический кошмар, погружающий в атмосферу подсознательных страхов, ревности и неизбежного безумия.',
            similarImages: ['Картинки 2 /61.jpg', 'Картинки 2 /62.jpg', 'Картинки 2 /63.jpeg']
        }
    ];
    
    var currentRandomIndex = 0;
    
    // ===== ЭЛЕМЕНТЫ =====
    var randomButton = document.querySelector('.content-wrapper2 .white-rectangle2');
    var mainImage = document.querySelector('.content-wrapper2 .main-image');
    var greenBlockText = document.querySelector('.content-wrapper2 .green-block-text');
    var purpleBlockText = document.querySelector('.content-wrapper2 .purple-block-text');
    var rectImages = document.querySelectorAll('.content-wrapper2 .rect-image');
    var imageItems = document.querySelectorAll('.content-wrapper2 .image-item');
    
    // Принудительно задаём одинаковые размеры всем контейнерам
    function fixImageSizes() {
        var fixedWidth = 230;
        var fixedHeight = 300;
        
        for (var i = 0; i < imageItems.length; i++) {
            imageItems[i].style.width = fixedWidth + 'px';
            imageItems[i].style.height = fixedHeight + 'px';
            imageItems[i].style.flexShrink = '0';
        }
        
        for (var i = 0; i < rectImages.length; i++) {
            rectImages[i].style.width = '100%';
            rectImages[i].style.height = '100%';
            rectImages[i].style.objectFit = 'cover';
            rectImages[i].style.display = 'block';
        }
    }
    
    function updateRandomContent() {
        var set = randomSets[currentRandomIndex];
        
        if (mainImage) {
            mainImage.src = set.mainImage;
        }
        
        if (greenBlockText) {
            greenBlockText.innerHTML = set.titleText;
        }
        
        if (purpleBlockText) {
            purpleBlockText.innerHTML = set.description;
        }
        
        if (rectImages.length === 3) {
            for (var i = 0; i < rectImages.length; i++) {
                rectImages[i].src = set.similarImages[i];
            }
        }
        
        // Применяем одинаковые размеры после смены картинок
        setTimeout(fixImageSizes, 10);
    }
    
    function animateButton() {
        if (randomButton) {
            randomButton.style.transition = 'all 0.3s ease';
            randomButton.style.backgroundColor = '#B7B681';
            randomButton.style.transform = 'scale(0.98)';
            
            var buttonText = randomButton.querySelector('.button-text2');
            if (buttonText) {
                buttonText.style.color = '#ffffff';
            }
            
            setTimeout(function() {
                randomButton.style.backgroundColor = '';
                randomButton.style.transform = 'scale(1)';
                if (buttonText) {
                    buttonText.style.color = '';
                }
            }, 800);
        }
    }
    
    function nextRandomSet() {
        currentRandomIndex = (currentRandomIndex + 1) % randomSets.length;
        updateRandomContent();
        animateButton();
    }
    
    if (randomButton) {
        randomButton.onclick = nextRandomSet;
    }
    
    // Инициализация
    fixImageSizes();
    updateRandomContent();
    
});