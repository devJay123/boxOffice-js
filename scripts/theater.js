let row = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const seatBox = document.querySelector('.seat_box');

const selectBox = document.querySelector('.select_box');
const allSeatNum = selectBox.querySelectorAll('span.num');
const seatBtn = document.querySelectorAll('.seat_btn');

// 화면에 좌석 그리기
function generateSeatHTML(row, col) {
  return `<span class="seat" data-row="${row}" data-col="${col}">${row}${
    col < 10 ? '0' + col : col
  }</span>`;
}

function generateRowHTML(row) {
  return `
          <div class="row ${row}">
            ${Array.from({ length: 14 }, (_, j) => j + 1)
              .map((col) => generateSeatHTML(row, col))
              .join('')}
          </div>
        `;
}

let seats = row.map(generateRowHTML).join('');
seatBox.innerHTML = seats;

let chooseSeats = [];

// 요금을 저장하는 객체배열
let fee = [
  { seat: 'adult', price: 10000, num: 0 },
  { seat: 'child', price: 7000, num: 0 },
  { seat: 'uncomportable', price: 4000, num: 0 },
];

// 수정 후 (function을 쪼갬)
// 좌석 개수를 선택하는 버튼의 이벤트
let allSeatsCount = 0;

const updateSeatDisplay = (span, seatCount) => {
  span.innerText = seatCount;
};

const updateFeeDisplay = (feeDiv, feeIndex) => {
  feeDiv.innerHTML =
    (fee[feeIndex].num * fee[feeIndex].price).toLocaleString() + ' 원';
};

const feeSum = document.querySelector('.fee_sum');
const updateTotalFeeDisplay = () => {
  feeSum.innerHTML =
    fee.reduce((acc, cur) => acc + cur.num * cur.price, 0).toLocaleString() +
    ' 원';
};

const handleSeatChange = (event) => {
  let li = event.target.closest('li');
  let feeDiv = li.querySelector('.fee');
  let seat = li.className;

  let span = event.target.parentElement.querySelector('.num');
  let seatNum = parseInt(span.textContent);

  let seatFeeIdx = fee.findIndex((el) => el.seat == seat);

  if (event.target.classList.contains('plus')) {
    seatNum++;
    allSeatsCount++;
    fee[seatFeeIdx].num++;

    updateSeatDisplay(span, seatNum);
    updateFeeDisplay(feeDiv, seatFeeIdx);
    updateTotalFeeDisplay();
  } else {
    if (seatNum > 0 && chooseSeats.length < allSeatsCount) {
      seatNum--;
      allSeatsCount--;
      fee[seatFeeIdx].num--;

      updateSeatDisplay(span, seatNum);
      updateFeeDisplay(feeDiv, seatFeeIdx);
      updateTotalFeeDisplay();
    } else if (chooseSeats.length >= allSeatsCount && allSeatsCount !== 0) {
      alert('좌석을 제거할 수 없습니다.');
    }
  }
};

seatBtn.forEach((btn) => {
  btn.addEventListener('click', handleSeatChange);
});

// 수정 전 버전
/* 
seatBtn.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    let li = event.target.closest('li');
    let feeDiv = li.querySelector('.fee');
    let seat = li.className;

    let span = event.target.parentElement.querySelector('.num');
    let seatNum = span.textContent;

    let seatFeeIdx = fee.findIndex((el) => el.seat == seat);

    let feeSum = document.querySelector('.fee_sum');

    if (event.target.classList.contains('plus')) {
      span.innerText = ++seatNum;
      ++allSeatsCount;
      fee[seatFeeIdx].num++;

      feeDiv.innerHTML =
        (fee[seatFeeIdx].num * fee[seatFeeIdx].price).toLocaleString() + ' 원';

      feeSum.innerHTML =
        fee
          .reduce((acc, cur) => acc + cur.num * cur.price, 0)
          .toLocaleString() + ' 원';
    } else {
      // 숫자가 0 이상일 때만 빼기 가능
      // 이미 선택한 좌석 수 보다 적게 되도록 빼기 불가능
      if (seatNum > 0 && chooseSeats.length < allSeatsCount) {
        span.innerText = --seatNum;
        --allSeatsCount;
        fee[seatFeeIdx].num--;

        feeDiv.innerHTML =
          (fee[seatFeeIdx].num * fee[seatFeeIdx].price).toLocaleString() +
          ' 원';

        feeSum.innerHTML =
          fee
            .reduce((acc, cur) => acc + cur.num * cur.price, 0)
            .toLocaleString() + ' 원';
      } else if (chooseSeats.length >= allSeatsCount && allSeatsCount !== 0) {
        alert('좌석을 모두 선택하셨습니다.');
      }
    }
  });
});
 */

// seat를 click하면 발동되는 함수.
// seat의 row와 col을 읽어오고, 'data-selected'함수를 부여함
function clickSeat(event) {
  const seat = event.target;
  const row = seat.dataset.row;
  const col = parseInt(seat.dataset.col);

  let nextSibling = seat.nextElementSibling;
  let nextSiblings = [];

  for (let i = 0; i < allSeatsCount - 1 - chooseSeats.length; i++) {
    if (nextSibling == null) break;
    nextSiblings.push(nextSibling);
    nextSibling = nextSibling.nextElementSibling;
  }

  if (seat.hasAttribute('data-selected')) {
    // Deselect the seat
    seat.removeAttribute('data-selected');
    // chooseSeats에서 삭제
    chooseSeats = chooseSeats.filter(
      (obj) => obj.row !== row || obj.col !== col
    );
  } else {
    // Select the seat
    seat.setAttribute('data-selected', true);
    chooseSeats.push({ row, col });

    nextSiblings.forEach((el) => {
      el.setAttribute('data-selected', true);
      chooseSeats.push({ row: el.dataset.row, col: Number(el.dataset.col) });
    });
  }
}

// seatBox 안에 seat를 click 할 때 이벤트
// a태그에 click event를 모두 하나씩 주는 것 보다, seatBox에 event 하나 주는 게
// 성능적으로 더 좋음
seatBox.addEventListener('click', (event) => {
  let rtmp = event.target.dataset.row;
  let ctmp = event.target.dataset.col;

  if (allSeatsCount == 0) {
    event.stopPropagation();
    alert('인원을 선택해주세요');
    return;
  } else if (
    allSeatsCount == chooseSeats.length &&
    !chooseSeats.find((el) => el.row == rtmp && el.col == ctmp)
  ) {
    event.stopPropagation();
    alert('모두 선택하셨습니다');
    return;
  }
  if (event.target.matches('span.seat')) {
    // const row = event.target.textContent[0];
    // const col = parseInt(event.target.textContent.slice(1));
    clickSeat(event);
  }
});

// seat mouseenter 이벤트
// seat에 mouse를 올리면 회색으로 되도록
const seatArr = seatBox.querySelectorAll('.seat');

function addSeatEvent(seatArr) {
  seatArr.forEach((el) => {
    // 마우스가 진입할 때
    el.addEventListener('mouseenter', () => {
      // 이미 선택된 좌석에 마우스 진입하면 sibling에 hover 주지 않음
      let nowSeat = event.target;
      let nowSeatRow = nowSeat.dataset.row;
      let nowSeatCol = nowSeat.dataset.col;
      let stop = 1;
      chooseSeats.forEach((el) => {
        if (el.row == nowSeatRow && el.col == nowSeatCol) {
          stop = 0;
          return;
        }
      });

      if (
        allSeatsCount == 0 ||
        allSeatsCount <= chooseSeats.length ||
        stop == 0
      ) {
        return;
      }

      el.classList.add('hover');

      // 마우스 올린 좌석 옆에 좌석들도 hover 주기
      let nextSibling = event.target.nextElementSibling;
      let nextSiblings = [];

      if (nextSibling === null) {
        return;
      }

      for (let i = 0; i < allSeatsCount - 1 - chooseSeats.length; i++) {
        nextSiblings.push(nextSibling);
        nextSibling = nextSibling.nextElementSibling;
        if (nextSibling === null) {
          break;
        }
      }

      nextSiblings.forEach((sibling) => {
        sibling.classList.add('hover');
      });
    });

    // 마우스가 벗어날 때
    el.addEventListener('mouseleave', () => {
      el.classList.remove('hover');

      let nextSibling = event.target.nextElementSibling;
      let nextSiblings = [];

      if (nextSibling === null) {
        return;
      }

      for (let i = 0; i < allSeatsCount - 1; i++) {
        nextSiblings.push(nextSibling);
        nextSibling = nextSibling.nextElementSibling;
        if (nextSibling === null) {
          break;
        }
      }

      nextSiblings.forEach((sibling) => {
        sibling.classList.remove('hover');
      });
    });
  });
}

addSeatEvent(seatArr);

// 모두 초기화 버튼
// chooseSeats = [];
// allSeatsCount = 0;
// span.num 모두 0으로
// div.fee 모두 0원으로
// span.fee_sum 0원으로
// 좌석 선택 초기화
// .seat[data-selected] 에서 data-selected 속성 삭제하기

const resetBtn = document.querySelector('.reset');
const divFees = document.querySelectorAll('.fee');

resetBtn.addEventListener('click', () => {
  // seat.num 모두 0으로
  allSeatNum.forEach((el) => (el.innerText = 0));
  // div.fee 모두 0으로
  divFees.forEach((el) => (el.innerText = '0 원'));
  // span.fee_sum 0원으로
  feeSum.innerText = '0 원';

  chooseSeats = [];
  allSeatsCount = 0;

  fee.forEach((item) => (item.num = 0));

  seatArr.forEach((el) => {
    el.removeAttribute('data-selected');
  });
});
