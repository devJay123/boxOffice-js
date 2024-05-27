const seatBox = document.querySelector('.seat_box');
let row = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const selectBox = document.querySelector('.select_box');

const adultSeat = document.querySelector('.adult_seat');

const allSeatNum = selectBox.querySelectorAll('span.num');

const seatBtn = document.querySelectorAll('.seat_btn');

// Q
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

// Q
function clickSeat(event) {
  const seat = event.target;
  const row = seat.dataset.row;
  const col = parseInt(seat.dataset.col);

  if (seat.hasAttribute('data-selected')) {
    // Deselect the seat
    seat.removeAttribute('data-selected');
    chooseSeats = chooseSeats.filter(
      (obj) => obj.row !== row || obj.col !== col
    );
  } else {
    // Select the seat
    seat.setAttribute('data-selected', true);
    chooseSeats.push({ row, col });
  }
}

let allNum = 0;

seatBtn.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    let span = event.target.parentElement.querySelector('.num');
    let seatNum = span.textContent;

    if (event.target.classList.contains('plus')) {
      span.innerText = ++seatNum;
      ++allNum;
    } else {
      if (seatNum > 0) {
        span.innerText = --seatNum;
        --allNum;
      }
    }
  });
});

// Q
// a태그에 click event를 모두 하나씩 주는 것 보다, seatBox에 event 하나 주는 게
// 성능적으로 더 좋음
seatBox.addEventListener('click', (event) => {
  let rtmp = event.target.dataset.row;
  let ctmp = event.target.dataset.col;

  if (allNum == 0) {
    event.stopPropagation();
    alert('인원을 선택해주세요');
    return;
  } else if (
    allNum == chooseSeats.length &&
    !chooseSeats.find((el) => el.row == rtmp && el.col == ctmp)
  ) {
    event.stopPropagation();
    alert('모두 선택하셨습니다');
    return;
  }
  if (event.target.matches('span.seat')) {
    const row = event.target.textContent[0];
    const col = parseInt(event.target.textContent.slice(1));
    clickSeat(event);
  }
});
