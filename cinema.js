// Get form element with id formChanges
const formChanges = document.getElementById('formChanges');
// Get admin section
const adminSection = document.querySelector('.adminSection');
// Get element with id outputResults
const outputResults = document.querySelector('.outputResults');
// Get element with id outputSeats
const outputSeats = document.getElementById('outputSeats');
// Get element with total class
const total = document.querySelector('.total');
// Get all elements with seat class
const allSeats = document.querySelectorAll('.seat');

// Buttons

// Get btn with id submit-NotAdmin-Changes
const submitNotAdminChanges = document.getElementById(
  'submit-NotAdmin-Changes'
);
// Get btn with id btnInit
const btnInit = document.getElementById('btnInit');
// Get btn with id adminChanges
const adminChanges = document.getElementById('adminChanges');
// Get btn with id undoSelected
const undoSelected = document.getElementById('undoSelected');
// Get btn with id adminMenu
const adminMenu = document.getElementById('adminMenu');
// Get btn with id cancel
const btnCancel = document.getElementById('cancel');
// Get btn with id adminLogOut
const adminLogOut = document.getElementById('adminLogOut');

// Values

// Init value for total amount
let totalSum = 0;
// Init values for selected seat(s)
let selectedSeats = [];
// Init value for isAdmin
let isAdmin = false;

// Form submit
formChanges.addEventListener('submit', function (form) {
  // Prevent form default
  form.preventDefault();

  // Init values for username and password
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Get admin users from local storage
  var admins = JSON.parse(localStorage.getItem('cinemaAdmins'));
  // Loop through admin users
  admins.forEach((admin) => {
    // Admin login / validation
    if (username == admin.username && password == admin.password) {
      isAdmin = true;
      adminUsername = document.getElementById('adminUsername');
      adminUsername.textContent = `${admin.username}`;
      formChanges.style.visibility = 'hidden';
      adminSection.style.visibility = 'visible';
    } else {
      alert('User Not Found');
    }
  });

  formChanges.reset();
});

// Window on click
window.onclick = (clickedElement) => {
  if (!isAdmin) {
    // Check if the clicked element has tagname div and bg green
    if (
      clickedElement.target.tagName == 'DIV' &&
      clickedElement.target.style.backgroundColor == 'green'
    ) {
      // Adding orange color to the clicked element's bg
      clickedElement.target.style.backgroundColor = 'rgb(240, 172, 47)';
      // Push element to selectedSeats
      selectedSeats.push(clickedElement.target.id.split('_'));
      // Set btn submit-NotAdmin-Changes visibility
      submitNotAdminChanges.style.visibility = 'visible';
      // Check if the clicked element has tagname div and bg orange
    } else if (
      clickedElement.target.tagName == 'DIV' &&
      clickedElement.target.style.backgroundColor == 'rgb(240, 172, 47)'
    ) {
      // Remove clicked element from selectedSeats
      var removeSeat = clickedElement.target.id.split('_');
      selectedSeats.forEach((selected, index) => {
        if (removeSeat[0] == selected[0] && removeSeat[1] == selected[1]) {
          selectedSeats.splice(index, 1);
        }
      });
      // Add green color to the clicked element's bg
      clickedElement.target.style.backgroundColor = 'green';
      // Check if isAdmin is true, clicked element has tagname div and bg red
    }
  } else {
    if (
      clickedElement.target.tagName == 'DIV' &&
      clickedElement.target.style.backgroundColor == 'red'
    ) {
      // Add green color to the clicked element's bg
      clickedElement.target.style.backgroundColor = 'green';

      undoSelected.style.visibility = 'visible';
      adminChanges.style.visibility = 'visible';
    }
  }

  // Add selected seats to the ul
  let showSeats = '';
  selectedSeats.forEach((element) => {
    showSeats += `<li>${element[1]} ${element[0]} <span class="seat-price">6£</span> ;</li>`;
  });
  totalSum = 6 * selectedSeats.length;
  total.textContent = `Total Amount: ${totalSum}£`;
  if (selectedSeats.length == 1) {
    outputSeats.innerHTML = 'Selected seat: ' + showSeats;
  } else if (selectedSeats.length > 1) {
    outputSeats.innerHTML = 'Selected seats: ' + showSeats;
  } else {
    outputSeats.innerHTML = 'Selected seat(s): ';
    total.textContent = `Total Amount: `;
    submitNotAdminChanges.style.visibility = 'hidden';
  }
};

// Window on mouseenter
window.onmouseover = (overElement) => {
  if (!isAdmin) {
    // check if hovered element has tagname div and (bg green or orange)
    if (
      overElement.target.tagName == 'DIV' &&
      (overElement.target.style.backgroundColor == 'green' ||
        overElement.target.style.backgroundColor == 'rgb(240, 172, 47)')
    ) {
      overElement.target.style.transform = 'scale(1.15)';
      // check if element has bg red
    } else if (overElement.target.style.backgroundColor == 'red') {
      overElement.target.style.cursor = 'not-allowed';
    }
  } else {
    // check if hovered element has tagname div and (bg green or orange)
    if (
      overElement.target.tagName == 'DIV' &&
      (overElement.target.style.backgroundColor == 'green' ||
        overElement.target.style.backgroundColor == 'rgb(240, 172, 47)')
    ) {
      overElement.target.style.transform = 'scale(1)';
      // check if element has bg red
    } else if (overElement.target.style.backgroundColor == 'red') {
      overElement.target.style.cursor = 'pointer';
    }
  }
};

// Window on mouseout
window.onmouseout = (elementOut) => {
  // check if element has tagname div and bg green
  if (
    elementOut.target.tagName == 'DIV' &&
    elementOut.target.style.backgroundColor == 'green'
  ) {
    elementOut.target.style.transform = 'scale(1)';
  }
};

// btn Start (setting up seats local storage if empty)
function initSeats() {
  // Set total amount visibility
  total.style.visibility = 'visible';
  // Set selected seats output visibility
  outputResults.style.visibility = 'visible';

  adminMenu.style.visibility = 'visible';

  var httpSeats = new XMLHttpRequest();
  httpSeats.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var responseSeats = JSON.parse(httpSeats.responseText);
      if (localStorage.getItem('seats') === null) {
        var seats = responseSeats;
        localStorage.setItem('seats', JSON.stringify(seats));
      } else {
        var seats = JSON.parse(localStorage.getItem('seats'));

        seats.forEach((seat) => {
          seat.color = 'green';
        });

        localStorage.setItem('seats', JSON.stringify(seats));
      }
    }
  };
  httpSeats.open('GET', 'seats.json', true);
  httpSeats.send();

  initAdmins();
}

// Setting up admin users local storage if empty
function initAdmins() {
  var httpAdmins = new XMLHttpRequest();
  httpAdmins.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var responseAdmin = JSON.parse(httpAdmins.responseText);
      if (localStorage.getItem('cinemaAdmins') === null) {
        var admins = responseAdmin;
        localStorage.setItem('cinemaAdmins', JSON.stringify(admins));
      } else {
        var admins = JSON.parse(localStorage.getItem('cinemaAdmins'));
        console.log('admins');
      }

      onLoaded();
    }
  };
  httpAdmins.open('GET', 'cinemaAdmins.json', true);
  httpAdmins.send();
}

// On Page Load
function onLoaded() {
  // Set the default text of the outputed seats
  outputSeats.textContent = 'Selected seat(s): ';
  selectedSeats = [];

  // Set the defaulth text of the total amount
  total.textContent = 'Total Amount: ';

  // Set the btn submitNotAdminChanges visibility
  submitNotAdminChanges.style.visibility = 'hidden';

  undoSelected.style.visibility = 'hidden';
  adminChanges.style.visibility = 'hidden';

  if (localStorage.getItem('seats') === null) {
    // Set total amount output visibility
    total.style.visibility = 'hidden';
    // Set selected seats output visibility
    outputResults.style.visibility = 'hidden';

    adminMenu.style.visibility = 'hidden';

    btnInit.style.visibility = 'visible';
  } else {
    // Set btn btnInit visibility
    btnInit.style.visibility = 'hidden';
    // Get seats from local storage
    var seats = JSON.parse(localStorage.getItem('seats'));
    // Loop through element with seat class
    allSeats.forEach((eachSeat) => {
      // Modify the scale of all div elements with seat class
      eachSeat.style.transform = 'scale(1)';
      // Loop through seats from localStorage
      seats.forEach((seat) => {
        // Check if element's id matches the seat's id
        if (eachSeat.id == seat.id) {
          // Set the element bg
          eachSeat.style.backgroundColor = seat.color;
        }
      });
    });
  }
}

// Not admin changes to local Storage (btn Save)
function saveNotAdminChanges() {
  var seats = JSON.parse(localStorage.getItem('seats'));
  allSeats.forEach((eachSeat) => {
    if (eachSeat.style.backgroundColor == 'rgb(240, 172, 47)') {
      const itemId = eachSeat.id;
      const itemColor = 'red';
      seats.forEach((seat, index) => {
        if (seat.id == itemId) {
          seats.splice(index, 1, { id: seat.id, color: itemColor });
        }
      });
    }
  });
  localStorage.setItem('seats', JSON.stringify(seats));

  onLoaded();
}

// Admin changes to local Storage (btn Save)
function saveAdminChanges() {
  var seats = JSON.parse(localStorage.getItem('seats'));
  allSeats.forEach((eachSeat) => {
    if (isAdmin && eachSeat.style.backgroundColor == 'green') {
      const itemId = eachSeat.id;
      const itemColor = 'green';
      seats.forEach((seat, index) => {
        if (seat.id == itemId) {
          seats.splice(index, 1, { id: seat.id, color: itemColor });
        }
      });
    }
  });

  const adminMessage = document.getElementById('adminMessage');

  adminMessage.textContent = 'Changes Approved';

  setTimeout(() => (adminMessage.textContent = ''), 2000);

  localStorage.setItem('seats', JSON.stringify(seats));

  onLoaded();
}

function undo() {
  undoSelected.style.visibility = 'hidden';
  adminChanges.style.visibility = 'hidden';

  var seats = JSON.parse(localStorage.getItem('seats'));
  // Loop through element with seat class
  allSeats.forEach((eachSeat) => {
    // Modify the scale of all div elements with seat class
    eachSeat.style.transform = 'scale(1)';
    // Loop through seats from localStorage
    seats.forEach((seat) => {
      // Check if element's id matches the seat's id
      if (eachSeat.id == seat.id) {
        // Set the element bg
        eachSeat.style.backgroundColor = seat.color;
      }
    });
  });
}

// On click event for button Save(AdminChanges)
adminChanges.addEventListener('click', saveAdminChanges);

undoSelected.addEventListener('click', undo);

// On click event for button Save(submit-NotAdmin-Changes)
submitNotAdminChanges.addEventListener('click', saveNotAdminChanges);

// On click event for button Start
btnInit.addEventListener('click', initSeats);

// On click event for admin menu ( btn Make Changes)
adminMenu.addEventListener('click', function () {
  formChanges.style.visibility = 'visible';
  adminMenu.style.visibility = 'hidden';
});

// On click event for button Cancel
btnCancel.addEventListener('click', function () {
  formChanges.style.visibility = 'hidden';
  adminMenu.style.visibility = 'visible';
});

adminLogOut.addEventListener('click', logOut);

function logOut() {
  adminChanges.style.visibility = 'hidden';
  undoSelected.style.visibility = 'hidden';
  isAdmin = false;
  adminSection.style.visibility = 'hidden';
  adminMenu.style.visibility = 'visible';
}
