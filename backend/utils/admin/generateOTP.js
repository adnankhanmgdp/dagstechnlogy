function generateOTP(){
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

async function sendOTP(otp, phone)
{
    const url= `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FASt_SMS_API}=otp&variables_values=${otp}&flash=0&numbers=${phone}` ;
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}

function generateRandomNumber(digits) {
    if (digits <= 0) {
      throw new Error("Number of digits must be a positive integer");
    }
  
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


module.exports = { sendOTP, generateOTP}