import nodemailer from 'nodemailer'


/**
 * Account activation email
 */

export const accountActivationMail = async (to , data) => {
    try {
        let transport = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port : process.env.MAIL_PORT,
            auth : {
                user : process.env.MAIL_ID,
                pass : process.env.MAIL_PASS
            }
         })
       await transport.sendMail({
            from :`Instagram ${process.env.MAIL_ID}`,
            to :to,
            subject  : "Account activation mail",
            html :` <style>
            body {
             background-color: #e9e9e9;
             margin: 0px;
            }
            .template-wrapper {
             background-color: #fff;
             width: 500px;
             margin: 100px auto 0px;
             border-radius: 5px;
             font-family: arial;
            }
             .template-wrapper a{
                 display: block;
                 padding: 10px 0px;
             }
             .template-wrapper img{
                 width: 100%;
             }
            .template-wrapper a img{
             width: 200px;
             display: block;
             margin: 0px auto ;
            }
            .body {
             padding: 20px;
            }
            .body a{
             display: block;
             text-decoration: none;
             background-color: #2487ed;
             text-align: center;
             color : #fff
            }
         </style>
        <div class="template-wrapper">
            <a href="https://sorobindu.com/">
                <img src="https://sorobindu.com/wp-content/uploads/2022/03/Sorobindu-logo-1.png" alt="">
            </a>
            <img src="https://c0.wallpaperflare.com/preview/737/862/336/woman-work-laptop-computer.jpg" alt="">
            <div class="body">
                <h1>Hi ${data.name}</h1>
                <p>wellcome to our Team</p>
                <a href="${data.link}">Verify your account</a>
            </div>
            
        </div>`
         })
    } catch (error) {
        console.log(error.message);
    }

     
}