const cardData = [
    { name: 'main()', description: 'C 프로그램의 시작점입니다. 모든 프로그램은 이 함수에서 실행을 시작합니다.' },
    { name: '#include', description: '헤더 파일을 포함시키는 전처리기 명령입니다. printf 등을 사용하기 위해 <stdio.h>를 포함합니다.' },
    { name: 'printf()', description: '화면(표준 출력)에 텍스트나 변수 값을 출력하는 함수입니다.' },
    { name: 'scanf()', description: '사용자로부터 키보드(표준 입력)를 통해 값을 입력받는 함수입니다.' },
    { name: 'int', description: '정수형 데이터를 저장하는 자료형입니다. (예: 1, 100, -5)' },
    { name: 'float', description: '소수점이 있는 실수형 데이터를 저장하는 자료형입니다.' },
    { name: 'if-else', description: '조건에 따라 서로 다른 코드를 실행하게 하는 조건문입니다.' },
    { name: 'for', description: '특정 횟수만큼 코드를 반복해서 실행할 때 사용하는 반복문입니다.' }
];

// 게임 상태 변수
let cards = [...cardData, ...cardData]; // 8쌍(16장)
let flippedCards = [];
let matchedHistory = []; // 매칭된 히스토리 저장
let isBoardLocked = false;

const grid = document.getElementById('cardGrid');
const descriptionContainer = document.getElementById('descriptionContainer');
const matchCountDisplay = document.getElementById('matchCount');

// 카드 셔플 함수 (Fisher-Yates) - 생략 없이 그대로 유지
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 초기화
function initGame() {
    shuffle(cards);
    grid.innerHTML = '';
    cards.forEach((data, index) => {
        const cardElement = createCardElement(data, index);
        grid.appendChild(cardElement);
    });
}

// 카드 엘리먼트 생성
function createCardElement(data, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = data.name;
    card.dataset.index = index;

    card.innerHTML = `
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${data.name}</div>
    `;

    card.addEventListener('click', () => handleCardClick(card, data));
    return card;
}

// 카드 클릭 핸들러
function handleCardClick(card, data) {
    if (isBoardLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push({ element: card, data: data });

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// 일치 여부 확인
function checkMatch() {
    const [card1, card2] = flippedCards;
    isBoardLocked = true;

    if (card1.data.name === card2.data.name) {
        // 일치 시
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            // 히스토리 관리: 최근 매치를 제일 앞에 추가
            matchedHistory.unshift(card1.data);
            updateDescriptionPanel();
            
            updateStats();
            flippedCards = [];
            isBoardLocked = false;
            
            if (matchedHistory.length === cardData.length) {
                setTimeout(() => alert('축하합니다! 모든 C언어 개념을 마스터하셨습니다.'), 500);
            }
        }, 600);
    } else {
        // 불일치 시: 0.5초 후 복구
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            flippedCards = [];
            isBoardLocked = false;
        }, 500);
    }
}

// 설명 패널 업데이트 (최근 매치 상단)
function updateDescriptionPanel() {
    if (matchedHistory.length === 0) {
        descriptionContainer.innerHTML = '<p class="placeholder-text">동일한 C언어 키워드 카드를 두 장 찾으면 이곳에 설명이 나타납니다.</p>';
        return;
    }

    descriptionContainer.innerHTML = matchedHistory.map((data, index) => `
        <div class="match-item ${index === 0 ? 'recent' : ''}">
            <h3>${data.name}</h3>
            <p>${data.description}</p>
        </div>
    `).join('');
    
    // 항상 상단으로 스크롤 고정
    descriptionContainer.scrollTop = 0;
}

// 통계 업데이트
function updateStats() {
    matchCountDisplay.innerText = `${matchedHistory.length} / ${cardData.length}`;
}

initGame();
