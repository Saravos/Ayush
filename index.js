let startTime, endTime, captchaCode;

window.onload = function() {
    const firstInput = document.getElementById("userFirstName");
    firstInput.addEventListener('focus', startTimer);

    // Add listener for file input outside of form submission
    const fileInput1 = document.getElementById('file1');
    fileInput1.addEventListener('change', handleFileUpload1);

    const fileInput2 = document.getElementById('file2');
    fileInput2.addEventListener('change', handleFileUpload2);

    // Company selection logic
    const companySelect = document.getElementById("companies");
    const otherCompanyDiv = document.getElementById("otherCompanyDiv");
    companySelect.addEventListener("change", function() {
        if (companySelect.value === "Others") {
            otherCompanyDiv.style.display = "block";
        } else {
            otherCompanyDiv.style.display = "none";
        }
    });

    // Generate CAPTCHA when the page loads
    generateCaptcha();

    // Add the submit event listener to prevent page reload
    const form = document.getElementById("form");
    form.addEventListener('submit', saveFormData);
}

// Start timer when the user focuses on the first input field
function startTimer() {
    startTime = new Date();
}

// Handle file upload separately
function handleFileUpload1() {
    let file = this.files[0];
    const fileInfo = document.getElementById('fileInfo1');
    if (file) {
        fileInfo.textContent = `Selected File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    } else {
        fileInfo.textContent = 'No file selected';
    }
}

function handleFileUpload2() {
    let file = this.files[0];
    const fileInfo = document.getElementById('fileInfo2');
    if (file) {
        fileInfo.textContent = `Selected File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    } else {
        fileInfo.textContent = 'No file selected';
    }
}

// Function to generate CAPTCHA
function generateCaptcha() {
    captchaCode = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('captchaBox').textContent = captchaCode;
    document.getElementById('captchaError').style.display = 'none';
    document.getElementById('captchaInput').value = '';
}

// Function to validate CAPTCHA
function validateCaptcha() {
    const userInput = document.getElementById('captchaInput').value;
    if (userInput === captchaCode) {
        return true;
    } else {
        document.getElementById('captchaError').style.display = 'block';
        return false;
    }
}

// Function to capture end time and save form data to a .txt file
function saveFormData(event) {
    event.preventDefault();  // Prevent page reload

    // Capture end time and calculate time taken
    endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    document.getElementById('timeTaken').value = timeTaken;

    // Validate CAPTCHA
    if (!validateCaptcha()) {
        return false;  // Stop form submission if CAPTCHA is incorrect
    }

    // Collect form data
    const firstName = document.getElementById('userFirstName').value;
    const lastName = document.getElementById('userLastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const passport = document.getElementById('passport').value;
    const address = document.getElementById('address').value;
    const gender = document.getElementById('gender').value;
    const nationality = document.getElementById('nationality').value;

    let organization = document.getElementById('companies').value;
    if (organization === "Others") {
        const otherCompany = document.getElementById('otherCompany').value;
        if (otherCompany) {
            organization = otherCompany;
        }
    }

    // Get uploaded files
    const fileInput1 = document.getElementById('file1').files[0];
    const fileInput2 = document.getElementById('file2').files[0];
    const fileName1 = fileInput1 ? fileInput1.name : "No file uploaded";
    const fileName2 = fileInput2 ? fileInput2.name : "No file uploaded";

    // Create the content to be saved
    const formData = `First Name: ${firstName}\nLast Name: ${lastName}\nGender: ${gender}\nAddress: ${address}\nEmail: ${email}\nPhone: ${phone}\nNationality: ${nationality}\nPassport/EID Number: ${passport}\nOrganization: ${organization}\nFile1 Uploaded: ${fileName1}\nFile2 Uploaded: ${fileName2}\nTime Taken: ${timeTaken} seconds`;

    // Create a Blob and save it as a text file
    const blob = new Blob([formData], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "formData.txt");

    // Optional: Display a success message
    alert("Form submitted successfully!");

    return false;  // Prevent default form submission behavior
}