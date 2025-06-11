import Phaser from 'phaser';

export class IntroMathC1L1 extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroMathC1L1' });
    }

    init(data) {
        this.lesson = data.lesson || {};
    }

    create() {
        // Thêm background
        this.bg = this.add.image(512, 384, 'background').setDisplaySize(1024, 768);
        // Khởi tạo biến
        this.currentQuestion = 0;
        this.maxQuestions = 5;
        this.timer = null;
        this.timeLeft = 10;
        this.timerText = this.add.text(800, 60, '', { font: '24px Arial', color: '#ff3333', fontStyle: 'bold' });
        this.questionText = null;
        this.answerButtons = [];
        this.explainText = null;
        this.endText = null;
        this.generateQuestion();
    }

    generateQuestion() {
        // Xóa câu hỏi và đáp án cũ nếu có
        if (this.questionText) this.questionText.destroy();
        this.answerButtons.forEach(btn => btn.destroy());
        this.answerButtons = [];
        if (this.explainText) this.explainText.destroy();
        if (this.timer) this.timer.remove();
        this.timeLeft = 10;
        this.updateTimerText();
        this.currentQuestion++;
        if (this.currentQuestion > this.maxQuestions) {
            this.showEndGame();
            return;
        }
        // Danh sách số chính phương nhỏ (1-15)
        const squares = [1,4,9,16,25,36,49,64,81,100,121,144,169,196,225];
        const idx = Phaser.Math.Between(0, squares.length - 1);
        const number = squares[idx];
        const correct = Math.sqrt(number);
        // Sinh 2 đáp án sai gần đúng
        let wrong1 = correct + Phaser.Math.Between(1,2);
        let wrong2 = correct - Phaser.Math.Between(1,2);
        if (wrong2 <= 0 || wrong2 === correct) wrong2 = correct + Phaser.Math.Between(3,4);
        if (wrong1 === correct) wrong1 = correct + 2;
        // Trộn đáp án
        let answers = [correct, wrong1, wrong2].map(n => Math.round(n));
        Phaser.Utils.Array.Shuffle(answers);
        // Hiển thị câu hỏi
        this.questionText = this.add.text(350, 180, `Câu ${this.currentQuestion}/${this.maxQuestions}:\nCăn bậc 2 của ${number} là bao nhiêu?`, { font: '28px Arial', color: '#222', backgroundColor:'#fff', padding:10 })
            .setAlpha(0);
        this.tweens.add({ targets: this.questionText, alpha: 1, duration: 400 });
        // Hiển thị các ô đáp án
        answers.forEach((ans, i) => {
            let btn = this.add.text(400, 260 + i*70, ans.toString(), {
                font: '32px Arial',
                color: '#fff',
                backgroundColor: '#4CAF50',
                padding: 16,
                fixedWidth: 120,
                align: 'center',
                borderRadius: 10
            })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.checkAnswer(ans, correct, number, btn));
            btn.setAlpha(0);
            this.tweens.add({ targets: btn, alpha: 1, duration: 400, delay: 100*i });
            this.answerButtons.push(btn);
        });
        // Bắt đầu countdown
        this.timer = this.time.addEvent({
            delay: 1000,
            repeat: 9,
            callback: () => {
                this.timeLeft--;
                this.updateTimerText();
                if (this.timeLeft === 0) {
                    this.timer.remove();
                    this.showTimeUp(correct, number);
                }
            }
        });
    }

    updateTimerText() {
        this.timerText.setText('Thời gian: ' + this.timeLeft + 's');
        if (this.timeLeft <= 3) {
            this.tweens.add({ targets: this.timerText, scale: 1.3, yoyo: true, duration: 200, repeat: 1 });
        } else {
            this.timerText.setScale(1);
        }
    }

    checkAnswer(ans, correct, number, btn) {
        if (this.timer) this.timer.remove();
        this.answerButtons.forEach(b => b.disableInteractive());
        if (ans === correct) {
            btn.setStyle({ backgroundColor: '#00cc66' });
            this.tweens.add({ targets: btn, scale: 1.2, yoyo: true, duration: 200 });
            this.explainText = this.add.text(350, 480, 'Chính xác! Tiếp tục...', { font: '22px Arial', color: '#008800' });
            this.time.delayedCall(900, () => {
                this.explainText.destroy();
                this.generateQuestion();
            });
        } else {
            btn.setStyle({ backgroundColor: '#cc0000' });
            this.tweens.add({ targets: btn, angle: 10, yoyo: true, duration: 100, repeat: 2 });
            this.explainText = this.add.text(350, 480, `Sai! Căn bậc 2 của ${number} là ${correct}.`, { font: '22px Arial', color: '#cc0000' });
            this.time.delayedCall(1200, () => {
                this.explainText.destroy();
                this.generateQuestion();
            });
        }
    }

    showTimeUp(correct, number) {
        this.answerButtons.forEach(b => b.disableInteractive());
        this.explainText = this.add.text(350, 480, `Hết thời gian! Đáp án đúng là ${correct}.`, { font: '22px Arial', color: '#ff6600' });
        this.time.delayedCall(1200, () => {
            this.explainText.destroy();
            this.generateQuestion();
        });
    }

    showEndGame() {
        if (this.questionText) this.questionText.destroy();
        this.answerButtons.forEach(btn => btn.destroy());
        if (this.explainText) this.explainText.destroy();
        this.timerText.setVisible(false);
        this.endText = this.add.text(300, 350, 'Đã hoàn thành 5 câu hỏi!\nCảm ơn bạn đã chơi!', { font: '32px Arial', color: '#003399', backgroundColor:'#fff', padding:20, align:'center' });
        this.tweens.add({ targets: this.endText, scale: 1.2, yoyo: true, duration: 400, repeat: 2 });
    }
}