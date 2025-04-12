const mailer = require("nodemailer")

const sendMail = async(to,subject,message) => {

    const transporter = mailer.createTransport({
        service:'gmail',
        auth:{
            user:"sarojsoni1804@gmail.com",
            pass : "dtkz kqzg acsf xjhg"
        }
    })

    const mialOptions = {
        from : "sarojSoni1804@gmail.com",
        to : to,
        subject : subject,
        html : message
    }

    const res = await transporter.sendMail(mialOptions);

    return res;
}

module.exports= { sendMail }