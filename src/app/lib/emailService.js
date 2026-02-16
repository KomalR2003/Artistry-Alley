
import nodemailer from 'nodemailer';

// Create reusable email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

// Email templates
const getWelcomeEmailTemplate = (username, role) => {
    const isArtist = role === 'artist';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #171C3C;
                background: linear-gradient(135deg, #F5F7FA 0%, #E8EBF0 100%);
                padding: 20px;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(23, 28, 60, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #FE9E8F 0%, #D1CAF2 50%, #98C4EC 100%);
                padding: 50px 30px;
                text-align: center;
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat bottom;
                background-size: cover;
            }
            .header h1 {
                color: white;
                font-size: 32px;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1;
            }
            .emoji-large {
                font-size: 60px;
                margin-bottom: 15px;
                display: block;
            }
            .content {
                padding: 40px 35px;
            }
            .welcome-badge {
                display: inline-block;
                background: linear-gradient(135deg, #FE9E8F 0%, #D1CAF2 100%);
                color: white;
                padding: 8px 20px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 20px;
                box-shadow: 0 4px 15px rgba(254, 158, 143, 0.3);
            }
            .greeting {
                font-size: 24px;
                color: #171C3C;
                margin-bottom: 15px;
                font-weight: 600;
            }
            .intro-text {
                color: #666;
                margin-bottom: 30px;
                font-size: 16px;
            }
            .info-card {
                background: linear-gradient(135deg, #F8F9FA 0%, #E8EBF0 100%);
                padding: 25px;
                border-radius: 15px;
                margin: 25px 0;
                border-left: 5px solid ${isArtist ? '#FE9E8F' : '#98C4EC'};
                box-shadow: 0 4px 15px rgba(23, 28, 60, 0.05);
            }
            .info-row {
                display: flex;
                align-items: center;
                margin: 10px 0;
                font-size: 15px;
            }
            .info-label {
                color: #666;
                margin-right: 10px;
                font-weight: 500;
            }
            .info-value {
                color: #171C3C;
                font-weight: 700;
                font-size: 16px;
            }
            .section-title {
                color: #171C3C;
                font-size: 20px;
                font-weight: 700;
                margin: 30px 0 20px;
                display: flex;
                align-items: center;
            }
            .section-title::before {
                content: '';
                width: 4px;
                height: 24px;
                background: linear-gradient(135deg, #FE9E8F 0%, #D1CAF2 100%);
                margin-right: 12px;
                border-radius: 2px;
            }
            .features-grid {
                display: grid;
                gap: 12px;
                margin: 20px 0;
            }
            .feature-item {
                background: white;
                padding: 15px 20px;
                border-radius: 12px;
                border: 2px solid #F0F2F5;
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
                color: #171C3C;
            }
            .feature-icon {
                background: linear-gradient(135deg, ${isArtist ? '#FE9E8F' : '#98C4EC'} 0%, ${isArtist ? '#D1CAF2' : '#D1CAF2'} 100%);
                width: 35px;
                height: 35px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                flex-shrink: 0;
                box-shadow: 0 4px 10px rgba(254, 158, 143, 0.2);
            }
            .cta-section {
                background: linear-gradient(135deg, #171C3C 0%, #2a3154 100%);
                color: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                margin: 30px 0;
                box-shadow: 0 8px 25px rgba(23, 28, 60, 0.2);
            }
            .cta-text {
                font-size: 18px;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .footer {
                background: #F8F9FA;
                padding: 30px;
                text-align: center;
                color: #999;
                font-size: 13px;
                line-height: 1.8;
            }
            .social-icons {
                margin: 15px 0;
            }
            .divider {
                height: 3px;
                background: linear-gradient(90deg, #FE9E8F 0%, #D1CAF2 50%, #98C4EC 100%);
                margin: 25px 0;
                border-radius: 2px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <span class="emoji-large">🎨</span>
                <h1>Welcome to Artistry!</h1>
            </div>
            
            <div class="content">
                <div style="text-align: center;">
                    <span class="welcome-badge">${isArtist ? '🎨 ARTIST ACCOUNT' : '👤 USER ACCOUNT'}</span>
                </div>
                
                <p class="greeting">Hello ${username}! 👋</p>
                <p class="intro-text">We're absolutely thrilled to welcome you to <strong>Artistry</strong> - your creative digital space where art comes alive! Get ready to ${isArtist ? 'showcase your amazing talent' : 'discover incredible artworks'} and connect with a vibrant community of art lovers.</p>
                
                <div class="info-card">
                    <div class="info-row">
                        <span class="info-label">Account Type:</span>
                        <span class="info-value">${isArtist ? '🎨 Artist' : '👤 User'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Username:</span>
                        <span class="info-value">${username}</span>
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <h2 class="section-title">${isArtist ? 'Your Creative Toolkit' : 'Your Journey Begins'}</h2>
                
                <div class="features-grid">
                    ${isArtist ? `
                    <div class="feature-item">
                        <div class="feature-icon">📸</div>
                        <div>Upload & manage your stunning artwork gallery</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🛍️</div>
                        <div>List your products and reach art collectors</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">📊</div>
                        <div>Track views, likes & engagement stats</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🤝</div>
                        <div>Connect with art enthusiasts worldwide</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✨</div>
                        <div>Build your professional artist profile</div>
                    </div>
                    ` : `
                    <div class="feature-item">
                        <div class="feature-icon">🖼️</div>
                        <div>Browse stunning artworks from talented artists</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🛒</div>
                        <div>Discover & purchase unique art pieces</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">❤️</div>
                        <div>Like and save your favorite artworks</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">👨‍🎨</div>
                        <div>Follow and support your favorite artists</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🎭</div>
                        <div>Explore curated collections & exhibitions</div>
                    </div>
                    `}
                </div>
                
                <div class="cta-section">
                    <p class="cta-text">Ready to dive in? 🚀</p>
                    <p style="font-size: 14px; opacity: 0.9;">Log in to your account and start ${isArtist ? 'sharing your creativity with the world' : 'exploring amazing art today'}!</p>
                </div>
                
                <p style="margin-top: 30px; color: #666; font-size: 15px;">
                    Need help getting started? Our support team is here for you. Just reply to this email anytime!
                </p>
                
                <p style="margin-top: 30px; color: #171C3C; font-size: 16px; font-weight: 600;">
                    Happy ${isArtist ? 'Creating' : 'Exploring'}! 🎨✨<br>
                    <span style="font-weight: 400; font-size: 14px; color: #666;">The Artistry Team</span>
                </p>
            </div>
            
            <div class="footer">
                <div style="margin-bottom: 15px; color: #171C3C; font-weight: 600;">Artistry - Where Art Meets Passion</div>
                <p>This email was sent to you because you created an account on Artistry.</p>
                <p style="margin-top: 10px;">© 2026 Artistry. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const getLoginNotificationTemplate = (username, loginTime) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #171C3C;
                background: linear-gradient(135deg, #F5F7FA 0%, #E8EBF0 100%);
                padding: 20px;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(23, 28, 60, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #98C4EC 0%, #D1CAF2 50%, #FE9E8F 100%);
                padding: 50px 30px;
                text-align: center;
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,0 Q300,60 600,30 T1200,0 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat bottom;
                background-size: cover;
            }
            .emoji-large {
                font-size: 70px;
                margin-bottom: 15px;
                display: block;
                animation: wave 1.5s ease-in-out;
            }
            @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-10deg); }
                75% { transform: rotate(10deg); }
            }
            .header h1 {
                color: white;
                font-size: 32px;
                font-weight: 700;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1;
            }
            .content {
                padding: 40px 35px;
            }
            .success-badge {
                display: inline-block;
                background: linear-gradient(135deg, #98C4EC 0%, #D1CAF2 100%);
                color: white;
                padding: 10px 25px;
                border-radius: 25px;
                font-size: 15px;
                font-weight: 600;
                margin-bottom: 25px;
                box-shadow: 0 4px 15px rgba(152, 196, 236, 0.4);
            }
            .greeting {
                font-size: 26px;
                color: #171C3C;
                margin-bottom: 15px;
                font-weight: 700;
            }
            .subtext {
                color: #666;
                font-size: 16px;
                margin-bottom: 30px;
            }
            .login-card {
                background: linear-gradient(135deg, #F0F9FF 0%, #E8F4FD 100%);
                padding: 28px;
                border-radius: 15px;
                margin: 25px 0;
                border-left: 5px solid #98C4EC;
                box-shadow: 0 4px 20px rgba(152, 196, 236, 0.15);
            }
            .login-card h3 {
                color: #171C3C;
                font-size: 18px;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
            }
            .login-card h3::before {
                content: '✓';
                background: linear-gradient(135deg, #98C4EC 0%, #D1CAF2 100%);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                font-weight: bold;
                box-shadow: 0 3px 10px rgba(152, 196, 236, 0.3);
            }
            .detail-item {
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                margin: 10px 0;
                display: flex;
                align-items: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .detail-icon {
                background: linear-gradient(135deg, #98C4EC 0%, #D1CAF2 100%);
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-size: 20px;
            }
            .detail-content {
                flex: 1;
            }
            .detail-label {
                color: #999;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 3px;
            }
            .detail-value {
                color: #171C3C;
                font-size: 15px;
                font-weight: 600;
            }
            .tip-box {
                background: linear-gradient(135deg, #FFF9F5 0%, #FFF3E0 100%);
                padding: 20px 25px;
                border-radius: 12px;
                margin: 25px 0;
                border-left: 4px solid #FE9E8F;
            }
            .tip-box-title {
                color: #171C3C;
                font-weight: 700;
                font-size: 15px;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
            }
            .tip-box-title::before {
                content: '💡';
                margin-right: 8px;
                font-size: 18px;
            }
            .tip-box-text {
                color: #666;
                font-size: 14px;
                line-height: 1.7;
            }
            .footer {
                background: #F8F9FA;
                padding: 30px;
                text-align: center;
                color: #999;
                font-size: 13px;
                line-height: 1.8;
            }
            .divider {
                height: 3px;
                background: linear-gradient(90deg, #98C4EC 0%, #D1CAF2 50%, #FE9E8F 100%);
                margin: 30px 0;
                border-radius: 2px;
            }
            .signature {
                margin-top: 35px;
                padding-top: 25px;
                border-top: 2px solid #F0F2F5;
            }
            .signature-text {
                color: #171C3C;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 5px;
            }
            .signature-team {
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <span class="emoji-large">👋</span>
                <h1>Welcome Back!</h1>
            </div>
            
            <div class="content">
                <div style="text-align: center;">
                    <span class="success-badge">✓ SUCCESSFUL LOGIN</span>
                </div>
                
                <p class="greeting">Hey ${username}!</p>
                <p class="subtext">Great to see you back on Artistry!  You've successfully logged into your account. Let's create something amazing today!</p>
                
                <div class="login-card">
                    <h3>Login Activity</h3>
                    <div class="detail-item">
                        <div class="detail-icon">📅</div>
                        <div class="detail-content">
                            <div class="detail-label">Date & Time</div>
                            <div class="detail-value">${loginTime}</div>
                        </div>
                    </div>
                </div>
                
                <div class="tip-box">
                    <div class="tip-box-title">Security Tip</div>
                    <div class="tip-box-text">
                        If this login wasn't you, please secure your account immediately by changing your password. Your security is our top priority!
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <p style="color: #666; font-size: 15px; text-align: center;">
                    Continue exploring, creating, and connecting with the art community. Your next masterpiece awaits! 
                </p>
                
                <div class="signature">
                    <p class="signature-text">Keep Creating! </p>
                    <p class="signature-team">The Artistry Team</p>
                </div>
            </div>
            
            <div class="footer">
                <div style="margin-bottom: 15px; color: #171C3C; font-weight: 600;">Artistry - Where Art Meets Passion</div>
                <p>This is an automated login notification to keep your account secure.</p>
                <p style="margin-top: 10px;">© 2026 Artistry. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Send welcome email
export const sendWelcomeEmail = async (email, username, role) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"Artistry" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: ` Welcome to Artistry, ${username}!`,
            html: getWelcomeEmailTemplate(username, role),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

// Send login notification email
export const sendLoginNotificationEmail = async (email, username) => {
    try {
        const transporter = createTransporter();

        const loginTime = new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"Artistry" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: ' New Login to Your Artistry Account',
            html: getLoginNotificationTemplate(username, loginTime),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Login notification email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending login notification email:', error);
        return { success: false, error: error.message };
    }
};

export default {
    sendWelcomeEmail,
    sendLoginNotificationEmail,
};
