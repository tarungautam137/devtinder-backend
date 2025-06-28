const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "tarungautam137@gmail.com",
    pass: "pmjh ruzu jtri kcxc",
  },
});

const sendmail=async (sub,body)=>{

  const info = await transporter.sendMail({
    from: `ADMIN`,
    to: "tarungautam136@gmail.com",
    subject: sub,
    html:   `<h1> ${body} </h1>`
  })
}

module.exports=sendmail;