// Tạo mảng giá trị cho các thẻ bài
const createCardValues = () => {
    const cardTypes = [
        { type: "type1", imageUrl: "fire1.png" },
        { type: "type2", imageUrl: "fire2.png" },
        { type: "type3", imageUrl: "fire3.png" },
    ];

    const specialCards = [
        { type: "special1", imageUrl: "dea.png" },
    ];

    const totalCards = 47;
    const cardsPerType = Math.floor(totalCards / cardTypes.length);
    const remainder = totalCards % cardTypes.length;

    let deck = [];

    // Phân bổ thẻ cho các loại
    cardTypes.forEach((card, index) => {
        const count = cardsPerType + (index < remainder ? 1 : 0);
        deck = deck.concat(Array(count).fill({ ...card }));
    });

    // Xáo trộn danh sách
    deck = deck.sort(() => Math.random() - 0.5);

    // Chèn thẻ đặc biệt
    deck.splice(21, 0, specialCards[0]);
    deck.splice(27, 0, specialCards[0]);

    return deck;
};

let b= 0;
// Tạo và thêm thẻ vào bảng trò chơi
const createAndAddCard = (type, gameBoard) => {
    const card = document.createElement('div');
    card.classList.add('card');

    let a = 'tree.png';
    if (type.type == "special1") {
        a = 'home.png'
    }
    b = b+1;
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="background-image: url('${a}');">${b}</div>
            <div class="card-back" style="background-image: url('${type.imageUrl}');"></div>
        </div>
    `;
    gameBoard.appendChild(card);

    card.addEventListener('click', () => handleCardFlip(card));
};

// Xử lý logic chuyển đổi người chơi
const switchPlayer = (currentPlayer, bo, box1, box2) => {
    const nextPlayer = currentPlayer === 0 ? 1 : 0;
    bo.style.left = nextPlayer === 0 ? "0%" : "53%";
    box2.style.backgroundColor = nextPlayer === 0 ? "darkred" : "darkgray";
    box1.style.backgroundColor = nextPlayer === 1 ? "darkred" : "darkgray";
    return nextPlayer;
};

const ds_card = new Set([25]);     
// Xử lý lật thẻ
const handleCardFlip = (card) => {
    let number1 = parseInt(card.querySelector(".card-front").textContent); 

    let a = !card.classList.contains('flip') && ds_card.has(number1) && (number1 != 22 || number1 != 28);
    if (a && (watch_card==0 && un_fire == 0)){

        ds_card.add(number1);
        ds_card.add(number1+7);
        ds_card.add(number1-7);
        if (number1 > 9 || number1 < 7 || number1 === 9) {
            ds_card.add(number1 - 1);
        } 
        if ((number1 % 10 > 1 && number1 > 9) || number1 > 7 || number1 <7) {
            ds_card.add(number1 + 1);
        }

        card.classList.add('flip');
        document.body.classList.add('shake');

        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 300);

    if (un_eff==0) {

        re_scen();

        const cardBack = card.querySelector('.card-back');
        const backgroundUrl = window.getComputedStyle(cardBack).getPropertyValue('background-image');


        if (backgroundUrl.includes("fire1.png")) {
            player = switchPlayer(player, bo, box1, box2);
        } else if (backgroundUrl.includes("fire3.png")) {
            const newTool = document.createElement('div');
            // Gán hình ảnh URL cho background
            let rantool = tool_list[Math.floor(Math.random() * tool_list.length)]
            newTool.style.backgroundImage = 'url('+ rantool +')';
            newTool.classList.add('tool');

            const targetBox = player === 0 ? scrollBox2 : scrollBox1;
            targetBox.appendChild(newTool);
            player = switchPlayer(player, bo, box1, box2);

            newTool.addEventListener('click', () => readSpecialSkill(newTool));
            newTool.addEventListener('dblclick', () => activateSpecialSkill(newTool,card));
        } else if (backgroundUrl.includes("fire2.png")) {
            re_scen();
        }   else {
            document.querySelector(".won_scen").style.display = "flex";
            const div_win = document.querySelector('.win_box');
            // Thêm văn bản

            if (number1 == 22 && player==1) {
                div_win.textContent = 'Player 2 win';}  
            else   {
                div_win.textContent = 'Player 1 win';
            } 
        }
        //console.log(`Hình nền của thẻ: ${backgroundUrl}`);

        } else {
            player = switchPlayer(player, bo, box1, box2);
            re_scen()
        }

    }  else if (a && (watch_card==1)) {
        card.classList.add('flip');

        setTimeout(() => {
           card.classList.remove('flip');
        }, 800);

        re_scen();
}       else if (card.classList.contains('flip') && ds_card.has(number1) && (number1 != 22 || number1 != 28) && (un_fire==1)){
        const cardBack = card.querySelector('.card-back');
        cardBack.setAttribute('style', "background-image: url('fire1.png');");
        card.classList.remove('flip');
        re_scen();
    }  
};

// Khởi tạo trò chơi
const initializeGame = () => {
    const cardValues = createCardValues();
    const gameBoard = document.getElementById('gameBoard');

    cardValues.forEach((type) => createAndAddCard(type, gameBoard));
};

const re_scen = () =>{
    bo.style.padding = "100% 47% 0% 0%";
    if (player == 1) {
        bo.style.left = "53%"; }
    watch_card = 0;
    un_fire = 0;
    un_eff = 0;
}

// Biến toàn cục
let player = Math.floor(Math.random() * 2);
const bo = document.querySelector(".bo");
const box1 = document.querySelector(".box1");
const box2 = document.querySelector(".box2");
const scrollBox1 = document.querySelector('.box1 .scroll-box');
const scrollBox2 = document.querySelector('.box2 .scroll-box');

const tool_list = ["tool1.png","tool2.png","tool3.png","tool4.png","tool5.png"]

player = switchPlayer(player,bo,box1,box2)
// Bắt đầu trò chơi
initializeGame();
let watch_card = 0;
let un_fire = 0;
let un_eff = 0;
//_________________
const paragraph = document.querySelector('.information');

const readSpecialSkill = (cardType,card) =>{
    const cardTypes = window.getComputedStyle(cardType).getPropertyValue('background-image');

    
    paragraph.style.display = "flex";

    // Kiểm tra loại thẻ dựa trên đường dẫn
    if (cardTypes.endsWith('/tool1.png")')) {
        paragraph.textContent = "Đốt 1 lá bài trên sân đối thủ.";
    } if (cardTypes.endsWith('/tool2.png")')) {
        paragraph.textContent = "Đổi lượt chơi cho đối thủ.";

    } if (cardTypes.endsWith('/tool3.png")')) {
        paragraph.textContent = "Xem trước 1 lá bài.";  
    } if (cardTypes.endsWith('/tool4.png")')) {
        paragraph.textContent = "Chữa cháy một lá bài.";  
    } if (cardTypes.endsWith('/tool5.png")')) {
        paragraph.textContent = "Xóa tác dụng của lá bài tiếp theo.";  
    }

    setTimeout(() => {
            paragraph.style.display = "none";
        }, 1000);
};


//================================================
const activateSpecialSkill = (cardType) => {
    const cardTypes = window.getComputedStyle(cardType).getPropertyValue('background-image');

    // Kiểm tra loại thẻ dựa trên đường dẫn
    if (cardTypes.endsWith('/tool1.png")')) {
        bo.style.padding = "100% 20% 0% 0%";
        if (player == 1) {
            bo.style.left = "77%";
        }
        cardType.remove();


    } else if (cardTypes.endsWith('/tool2.png")')) {
        cardType.remove();
        player = switchPlayer(player, bo, box1, box2);

        document.body.classList.add('shake');

        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 300);

    }   else if (cardTypes.endsWith('/tool3.png")')) {

        bo.style.padding = "100% 20% 0% 0%";
        if (player == 1) {
            bo.style.left = "77%";
        }

        cardType.remove();
        watch_card = 1;

    }   else if (cardTypes.endsWith('/tool4.png")')) {
        cardType.remove();
        bo.style.padding = "100% 20% 0% 0%";
        if (player == 1) {
            bo.style.left = "77%";
        }
        un_fire = 1;
    }   else if (cardTypes.endsWith('/tool5.png")') ) {
        cardType.remove();
        un_eff = 1;

}
};


