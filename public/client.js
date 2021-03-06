/* eslint-disable no-use-before-define */
// client-side js
// run by the browser each time your view template is loaded

// define variables that reference elements on our page
const santaForm = document.forms[0]; // get all the forms from the page
const current = document.getElementById('current-comment'); // get the current amount of the characters in the textfield
const textWish = document.getElementById('text'); // get the wish from the textarea
const uName = document.getElementById('user'); // get the username from the input

// listen for the form to be submitted and add a new dream when it is
// eslint-disable-next-line func-names
santaForm.onsubmit = function (event) {
  checkInputs(); // a function to check the input in the textarea

  if (!checkInputs()) {
    event.preventDefault(); // preventDefault behaviour of a browser up submition of a form
  } // if the form is not validated
};

// Event listener to track the number of characters in the text area
textWish.addEventListener('keyup', () => {
  const characters = textWish.value.split(''); // create an array of the characters from the input (wish)
  // get the length of the array/ the amount of characters in the textarea on the webpage
  const charCount = characters.length;
  current.innerText = charCount; // update the data on the webpage

  // maxlength of the textarea assigned in the index.html
  const maxlength = textWish.maxLength;
  // the percentage of characters where the current indicator starts changing colors
  const changeColor = 0.75 * maxlength;

  if (charCount > changeColor && charCount < maxlength) {
    // if the textarea contains between 75% and 99% of maxlength change the color to ~orange-ish
    current.style.color = '#FF4500';
  } else if (charCount >= maxlength) {
    // if the textarea contains more than maxlength change the color to dark red
    current.style.color = '#B22222';
  } else {
    // if the textarea contains less than 75% of maxlength set the color to green
    current.style.color = 'green';
  }
});

// a function to validate the form
function checkInputs() {
  // get the values from the inputs
  const textWishValue = textWish.value;
  const uNameValue = uName.value;
  const characters = textWish.value.split('');
  // get the length of the array/ the amount of characters in the textarea on the webpage
  const charCount = characters.length;

  if (!textWishValue) { // if the textarea has no characters
    // show error
    setError(textWish, 'Please enter your wish');
    return false;
  }

  if (!uNameValue) {
    // show error
    setError(uName, 'Please enter your name');
    return false;
  }

  if (charCount <= 100) { // the text area has some amount of characters less than 101
    setSuccess(textWish); // if less than 100 characters send the wish
    return true;
  }
  setError(textWish, 'Only 100 characters allowed!'); // if more than 100 characters show an error message
  return false;
}

// a function to set an error message if the textarea has no input or more than 100 characters
function setError(input, message) {
  const formControl = input.parentElement; // .form-control
  const small = formControl.querySelector('small'); // an element reflecting the error message

  // add error message inside the small tag
  small.innerText = message;

  // add error class
  formControl.className = 'form-control error';
}

function setSuccess(input) {
  const formControl = input.parentElement; // .form-control
  // add error class
  formControl.className = 'form-control success';
}
