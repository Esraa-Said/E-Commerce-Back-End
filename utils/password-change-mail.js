const path = require("path");

const getPasswordChangedMail = (user) => {
  const mail = {
    from: `${process.env.SITE_NAME} <${process.env.SITE_EMAIL}>`,
    to: user.email,
    subject: `Your ${process.env.SITE_NAME} account password was changed`,
    text: `Hello ${user.firstName} ${user.lastName}, your password has been successfully changed.`,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../assets/logo.png"),
        cid: "logo",
      },
    ],
    html: `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">
        <div style="text-align:center;">
          <img src="cid:logo" alt="${process.env.SITE_NAME} Logo" width="250" style="margin-bottom:20px;" />
        </div>
        <h2 style="color:#333;">Hello ${user.name},</h2>
        <p style="color:#555;">This is a confirmation that your password for <strong>${process.env.SITE_NAME}</strong> has been successfully changed.</p>
        <p style="color:#555;">If you did not perform this change, please contact our support immediately.</p>
        <p style="font-size:12px; color:#888; border-top:1px solid #eee; padding-top:10px;">
          &copy; ${new Date().getFullYear()} ${process.env.SITE_NAME}. All rights reserved.
        </p>
      </div>
    `,
  };

  return mail;
};

module.exports = getPasswordChangedMail;
