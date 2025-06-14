import Phaser from 'phaser';
import { AppRouter } from '../router/AppRouter';

export class History2 extends Phaser.Scene {
    constructor() {
        super({ key: 'history2' });
    }

    preload() {
        this.load.image('chat_icon', '/assets/icon.png'); // Đảm bảo dùng đường dẫn tuyệt đối từ public
        this.load.image('background', '/assets/background.jpg');
    }

    create() {
        this.router = new AppRouter(this.game);
        // Thêm background trắng để icon không bị che
         this.bg = this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height);
        // this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0xffffff).setOrigin(0);
        // Thêm icon chat box ở góc dưới bên phải (cách mép phải và dưới 60px)
        const chatIcon = this.add.image(this.scale.width - 60, this.scale.height - 60, 'chat_icon')
            .setDisplaySize(56, 56)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);
        chatIcon.setAlpha(0.92);
        // Hiệu ứng hover
        chatIcon.on('pointerover', () => {
            chatIcon.setTint(0x00bfff);
            this.tweens.add({
                targets: chatIcon,
                scaleX: 0.5,
                scaleY: 0.5,
                duration: 100
            });
        });
        chatIcon.on('pointerout', () => {
            chatIcon.clearTint();
            this.tweens.add({
                targets: chatIcon,
                scaleX: 0.3,
                scaleY: 0.3,
                duration: 100
            });
        });
        // Sự kiện click (mở chat box HTML)
        chatIcon.on('pointerdown', () => {
            // Nếu đã có chat box thì không tạo thêm
            if (document.getElementById('phaser-chatbox')) return;
            const chatBox = document.createElement('div');
            chatBox.id = 'phaser-chatbox';
            chatBox.style.position = 'fixed';
            chatBox.style.right = '100px';
            chatBox.style.bottom = '60px';
            chatBox.style.width = '320px';
            chatBox.style.height = '380px';
            chatBox.style.background = '#fff';
            chatBox.style.border = '2px solid #1976d2';
            chatBox.style.borderRadius = '16px';
            chatBox.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
            chatBox.style.zIndex = 9999;
            chatBox.style.display = 'flex';
            chatBox.style.flexDirection = 'column';
            // Header
            const header = document.createElement('div');
            header.innerText = 'Chat Box';
            header.style.background = '#1976d2';
            header.style.color = '#fff';
            header.style.padding = '12px';
            header.style.fontWeight = 'bold';
            header.style.fontSize = '18px';
            header.style.borderTopLeftRadius = '14px';
            header.style.borderTopRightRadius = '14px';
            chatBox.appendChild(header);
            // Nội dung chat
            const chatContent = document.createElement('div');
            chatContent.style.flex = '1';
            chatContent.style.overflowY = 'auto';
            chatContent.style.padding = '10px';
            chatContent.style.fontSize = '15px';
            chatBox.appendChild(chatContent);
            // Input
            const inputWrap = document.createElement('div');
            inputWrap.style.display = 'flex';
            inputWrap.style.padding = '10px';
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Nhập tin nhắn...';
            input.style.flex = '1';
            input.style.padding = '8px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '6px';
            input.style.fontSize = '15px';
            inputWrap.appendChild(input);
            const sendBtn = document.createElement('button');
            sendBtn.innerText = 'Gửi';
            sendBtn.style.marginLeft = '8px';
            sendBtn.style.padding = '8px 16px';
            sendBtn.style.background = '#1976d2';
            sendBtn.style.color = '#fff';
            sendBtn.style.border = 'none';
            sendBtn.style.borderRadius = '6px';
            sendBtn.style.cursor = 'pointer';
            inputWrap.appendChild(sendBtn);
            chatBox.appendChild(inputWrap);
            // Đóng chat box
            const closeBtn = document.createElement('span');
            closeBtn.innerText = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '8px';
            closeBtn.style.right = '16px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '22px';
            closeBtn.style.color = '#fff';
            header.appendChild(closeBtn);
            closeBtn.onclick = () => chatBox.remove();
            // Gửi tin nhắn (tạm thời chat cứng, không gọi API)
            sendBtn.onclick = () => {
                if (input.value.trim()) {
                    const userMsg = input.value;
                    const msg = document.createElement('div');
                    msg.innerText = userMsg;
                    msg.style.margin = '6px 0';
                    msg.style.textAlign = 'right';
                    msg.style.color = '#1976d2';
                    chatContent.appendChild(msg);
                    chatContent.scrollTop = chatContent.scrollHeight;
                    input.value = '';
                    // Hiển thị phản hồi cứng
                    const aiMsg = document.createElement('div');
                    aiMsg.style.margin = '6px 0';
                    aiMsg.style.textAlign = 'left';
                    aiMsg.style.color = '#333';
                    const lowerMsg = userMsg.trim().toLowerCase();
                    if (lowerMsg === 'xin chào') {
                        aiMsg.innerText = 'Xin chào bạn!';
                    } else if (lowerMsg.includes('ai là vua đầu tiên của việt nam')) {
                        aiMsg.innerText = 'Vua đầu tiên của Việt Nam là Đinh Tiên Hoàng.';
                    } else if (lowerMsg.includes('bà trưng là ai') || lowerMsg.includes('hai bà trưng')) {
                        aiMsg.innerText = 'Hai Bà Trưng là những nữ anh hùng khởi nghĩa chống lại ách đô hộ phương Bắc.';
                    } else if (lowerMsg.includes('lý bí là ai')) {
                        aiMsg.innerText = 'Lý Bí là người sáng lập nhà Tiền Lý và xưng là Lý Nam Đế.';
                    } else if (lowerMsg.includes('chiến thắng bạch đằng')) {
                        aiMsg.innerText = 'Chiến thắng Bạch Đằng năm 938 do Ngô Quyền lãnh đạo, chấm dứt thời Bắc thuộc.';
                    } else if (lowerMsg.includes('nhà ngô')) {
                        aiMsg.innerText = 'Nhà Ngô là triều đại đầu tiên sau thời Bắc thuộc, do Ngô Quyền sáng lập.';
                    } else if (lowerMsg.includes('lý thường kiệt')) {
                        aiMsg.innerText = 'Lý Thường Kiệt là danh tướng thời Lý, nổi tiếng với chiến thắng chống quân Tống.';
                    } else if (lowerMsg.includes('trần hưng đạo')) {
                        aiMsg.innerText = 'Trần Hưng Đạo là vị tướng tài ba, lãnh đạo quân dân Đại Việt ba lần đánh bại quân Nguyên Mông.';
                    } else if (lowerMsg.includes('lê lợi')) {
                        aiMsg.innerText = 'Lê Lợi là lãnh tụ cuộc khởi nghĩa Lam Sơn, sáng lập nhà Hậu Lê.';
                    } else if (lowerMsg.includes('văn lang')) {
                        aiMsg.innerText = 'Văn Lang là quốc gia đầu tiên của người Việt, do các vua Hùng dựng nên.';
                    } else {
                        aiMsg.innerText = 'Tôi chỉ trả lời một số câu hỏi lịch sử cơ bản. Hãy hỏi về các nhân vật, sự kiện hoặc triều đại lịch sử Việt Nam!';
                    }
                    chatContent.appendChild(aiMsg);
                    chatContent.scrollTop = chatContent.scrollHeight;
                }
            };
            /*
            // --- Đoạn gọi API Gemini tạm thời bị comment lại ---
            sendBtn.onclick = async () => {
                if (input.value.trim()) {
                    const userMsg = input.value;
                    const msg = document.createElement('div');
                    msg.innerText = userMsg;
                    msg.style.margin = '6px 0';
                    msg.style.textAlign = 'right';
                    msg.style.color = '#1976d2';
                    chatContent.appendChild(msg);
                    chatContent.scrollTop = chatContent.scrollHeight;
                    input.value = '';
                    // Hiển thị đang trả lời
                    const aiMsg = document.createElement('div');
                    aiMsg.innerText = 'AI đang trả lời...';
                    aiMsg.style.margin = '6px 0';
                    aiMsg.style.textAlign = 'left';
                    aiMsg.style.color = '#888';
                    chatContent.appendChild(aiMsg);
                    chatContent.scrollTop = chatContent.scrollHeight;
                    // Gọi API Gemini (Google Generative Language API)
                    try {
                        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyDUeEqUFqe9B5g-tWT8IrNINY53seFk8Tc', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                contents: [{
                                    parts: [{ text: userMsg }]
                                }]
                            })
                        });
                        const data = await response.json();
                        let aiText = 'AI không trả lời được.';
                        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                            aiText = data.candidates[0].content.parts[0].text.trim();
                        }
                        aiMsg.innerText = aiText;
                        aiMsg.style.color = '#333';
                    } catch (e) {
                        aiMsg.innerText = 'Lỗi kết nối AI!';
                        aiMsg.style.color = '#f00';
                    }
                    chatContent.scrollTop = chatContent.scrollHeight;
                }
            };
            */
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') sendBtn.onclick();
            });
            document.body.appendChild(chatBox);
        });
    }
}