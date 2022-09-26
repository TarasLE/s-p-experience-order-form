function swiper(container, track, btnPrev, btnNext, items) {
    let position = 0;
    const mediaQuery1 = window.matchMedia('(min-width: 1400px)');
    const mediaQuery2 = window.matchMedia('(min-width: 1100px)');
    const mediaQuery3 = window.matchMedia('(min-width: 760px)');
    let slideToShow;
    if (mediaQuery1.matches) {
        slideToShow = 4;
    } else if (mediaQuery2.matches) {
        slideToShow = 3;
    } else if (mediaQuery3.matches) {
        slideToShow = 2;
    } else {
        slideToShow = 1;
    }
    
    const slideToSroll = 1;
    const itemsCount = items.length;
    const itemWidth = container.clientWidth / slideToShow;
    const movePosition = slideToSroll * itemWidth;

    items.forEach((item) => {
        item.style.minWidth = `${itemWidth}px`;
        })

        const setPosition = () => {
    track.style.transform = `translateX(${position}px)`;
    }

    const chekBtns = () => {
    btnPrev.disabled = position === 0;
    btnNext.disabled = position <= -(itemsCount - slideToShow) * itemWidth;
}
    
    btnNext.addEventListener('click', () => {
        const itemsLeft = itemsCount - (Math.abs(position) + slideToShow * itemWidth) / itemWidth;
        position -= itemsLeft >= slideToSroll ? movePosition : itemsLeft * itemWidth;
        setPosition();
        chekBtns();
    })

    btnPrev.addEventListener('click', () => {
        const itemsLeft = Math.abs(position) / itemWidth;
        position += itemsLeft >= slideToSroll ? movePosition : itemsLeft * itemWidth;
        setPosition();
        chekBtns();
    })
chekBtns();
}

export{swiper}