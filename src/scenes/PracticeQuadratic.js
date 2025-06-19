import Phaser from "phaser"
import RexInputText from "phaser3-rex-plugins/plugins/inputtext.js"
import katex from "katex"
import { evaluate, parse } from "mathjs"

import { AppRouter } from '../router/AppRouter';

export class PracticeQuadratic extends Phaser.Scene {
  constructor() {
    super({ key: "PracticeQuadratic" })
    this.renderedIcons = []
    this.iconCount = 0
  }

  preload() {
    // Tạo background gradient
    this.load.image(
      "background",
      "data:image/svg+xml;base64," +
        btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="800" height="600" fill="url(#grad1)" />
            </svg>
        `),
    )
  }

  create() {
    // Background
    this.add.image(0, 0, "background").setOrigin(0).setDisplaySize(this.scale.width, this.scale.height)

    // Back button
    const backBtn = this.add.rectangle(50, 30, 100, 40, 0x475569).setInteractive().setStrokeStyle(2, 0x64748b)
    this.add
      .text(50, 30, "← Quay lại", {
        color: "#ffffff",
        fontSize: "16px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      
    // Back button hover effects
    backBtn.on("pointerover", () => {
      backBtn.setFillStyle(0x334155)
      backBtn.setScale(1.05)
    })
    backBtn.on("pointerout", () => {
      backBtn.setFillStyle(0x475569)
      backBtn.setScale(1)
    })
    
    // Back button click handler
    backBtn.on("pointerdown", () => {
      this.scene.start('Grade9')
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/introduction/grade9')
      }
    })

    // Title
    this.add
      .text(400, 30, "🎮 Phaser LaTeX to Icon Renderer", {
        fontSize: "28px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)

    // Instructions
    this.add
      .text(400, 65, "Nhập công thức LaTeX và chuyển thành icon tương tác", {
        fontSize: "16px",
        color: "#94a3b8",
      })
      .setOrigin(0.5)

    // LaTeX Input Field
    const latexInput = new RexInputText(this, 400, 100, 400, 40, {
      type: "text",
      placeholder: "Nhập công thức LaTeX (ví dụ: 2\\sqrt{2}^2)",
      fontSize: "16px",
      backgroundColor: "#1e293b",
      color: "#fff",
      border: 2,
      borderColor: "#3b82f6",
      cornerRadius: 8,
    })
    this.add.existing(latexInput)

    // Buttons
    const renderBtn = this.add.rectangle(300, 150, 120, 40, 0x3b82f6).setInteractive().setStrokeStyle(2, 0x60a5fa)

    this.add
      .text(300, 150, "🚀 Render", {
        color: "#ffffff",
        fontSize: "16px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)

    const clearBtn = this.add.rectangle(500, 150, 120, 40, 0xef4444).setInteractive().setStrokeStyle(2, 0xf87171)

    this.add
      .text(500, 150, "🗑️ Clear All", {
        color: "#ffffff",
        fontSize: "16px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)

    // Button hover effects
    renderBtn.on("pointerover", () => {
      renderBtn.setFillStyle(0x2563eb)
      renderBtn.setScale(1.05)
    })
    renderBtn.on("pointerout", () => {
      renderBtn.setFillStyle(0x3b82f6)
      renderBtn.setScale(1)
    })

    clearBtn.on("pointerover", () => {
      clearBtn.setFillStyle(0xdc2626)
      clearBtn.setScale(1.05)
    })
    clearBtn.on("pointerout", () => {
      clearBtn.setFillStyle(0xef4444)
      clearBtn.setScale(1)
    })

    // Examples section
    this.add.text(50, 200, "📚 Ví dụ (Click để thử):", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
    })

    const examples = [
      "2\\sqrt{2}^2",
      "\\frac{a+b}{c-d}",
      "x^2 + y^2 = r^2",
      "\\int_0^\\infty e^{-x} dx",
      "\\sum_{i=1}^n i^2",
      "\\alpha + \\beta = \\gamma",
    ]

    examples.forEach((example, index) => {
      const row = Math.floor(index / 2)
      const col = index % 2
      const x = 50 + col * 350
      const y = 230 + row * 30

      const exampleBtn = this.add
        .text(x, y, `• ${example}`, {
          fontSize: "14px",
          color: "#60a5fa",
          backgroundColor: "#1e293b",
          padding: { x: 8, y: 4 },
        })
        .setInteractive()

      exampleBtn.on("pointerdown", () => {
        latexInput.text = example
      })

      exampleBtn.on("pointerover", () => {  
        exampleBtn.setStyle({ color: "#ffffff", backgroundColor: "#334155" })
      })

      exampleBtn.on("pointerout", () => {
        exampleBtn.setStyle({ color: "#60a5fa", backgroundColor: "#1e293b" })
      })
    })

    // Results area
    this.add
      .text(400, 350, "🎯 Kết quả:", {
        fontSize: "20px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)

    // Render button click handler
    renderBtn.on("pointerdown", () => {
      const latex = latexInput.text.trim()
      if (!latex) {
        this.showMessage("⚠️ Vui lòng nhập công thức LaTeX!", "#f59e0b")
        return
      }

      try {
        this.renderLatexToIcon(latex)
      } catch (err) {
        console.error("LaTeX Error:", err.message)
        this.showMessage(`❌ LaTeX Error: ${err.message}`, "#ef4444")
      }
    })

    // Clear button click handler
    clearBtn.on("pointerdown", () => {
      this.clearAllIcons()
    })

    // Enter key support
    latexInput.on("keydown", (event) => {
      if (event.keyCode === 13) {
        renderBtn.emit("pointerdown")
      }
    })
  }

  renderLatexToIcon(latex) {
    try {
      // Render LaTeX với KaTeX
      const html = katex.renderToString(latex, {
        throwOnError: true,
        displayMode: false,
        output: "html",
      })

      // Tạo DOM element để render
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.top = "-9999px"
      container.style.left = "-9999px"
      container.style.padding = "20px"
      container.style.backgroundColor = "#ffffff"
      container.style.fontSize = "32px"
      container.style.fontFamily = "KaTeX_Main, serif"
      container.style.border = "2px solid #e5e7eb"
      container.style.borderRadius = "8px"
      container.innerHTML = html

      document.body.appendChild(container)

      // Đợi DOM render rồi tạo canvas
      setTimeout(() => {
        this.createCanvasFromContainer(container, latex)
        document.body.removeChild(container)
      }, 100)
    } catch (err) {
      console.error("Render error:", err)
      this.showMessage(`❌ Render Error: ${err.message}`, "#ef4444")
    }
  }

  createCanvasFromContainer(container, latex) {
    // Lấy dimensions của container
    const rect = container.getBoundingClientRect()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Set canvas size với padding
    const padding = 30
    canvas.width = Math.max(rect.width + padding * 2, 200)
    canvas.height = Math.max(rect.height + padding * 2, 100)

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#ffffff")
    gradient.addColorStop(0.5, "#f8fafc")
    gradient.addColorStop(1, "#e2e8f0")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2)

    // Render LaTeX với Unicode conversion
    const displayText = this.convertLatexToUnicode(latex)

    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 24px serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Render main formula
    ctx.fillText(displayText, canvas.width / 2, canvas.height / 2 - 10)

    // Render original LaTeX
    ctx.font = "12px monospace"
    ctx.fillStyle = "#64748b"
    ctx.fillText(latex, canvas.width / 2, canvas.height - 15)

    this.addIconToScene(canvas, latex)
  }

  convertLatexToUnicode(latex) {
    let result = latex

    // Xử lý sqrt với parentheses - IMPROVED
    result = result.replace(/(\d*)\\sqrt\{([^}]+)\}/g, (match, coeff, content) => {
      const coefficient = coeff || ""
      return `${coefficient}√(${content})`
    })

    // Xử lý fractions
    result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")

    // Xử lý superscripts - IMPROVED để handle multiple digits
    result = result.replace(/\^(\d+)/g, (match, num) => {
      const superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹"
      return num
        .split("")
        .map((d) => superscripts[Number.parseInt(d)] || d)
        .join("")
    })

    // Xử lý subscripts
    result = result.replace(/_(\d+)/g, (match, num) => {
      const subscripts = "₀₁₂₃₄₅₆₇₈₉"
      return num
        .split("")
        .map((d) => subscripts[Number.parseInt(d)] || d)
        .join("")
    })

    // Greek letters và symbols
    const symbols = {
      "\\alpha": "α",
      "\\beta": "β",
      "\\gamma": "γ",
      "\\delta": "δ",
      "\\epsilon": "ε",
      "\\theta": "θ",
      "\\lambda": "λ",
      "\\mu": "μ",
      "\\pi": "π",
      "\\sigma": "σ",
      "\\phi": "φ",
      "\\omega": "ω",
      "\\int": "∫",
      "\\sum": "∑",
      "\\infty": "∞",
      "\\lim": "lim",
      "\\to": "→",
      "\\rightarrow": "→",
      "\\leftarrow": "←",
      "\\pm": "±",
      "\\mp": "∓",
      "\\times": "×",
      "\\div": "÷",
      "\\leq": "≤",
      "\\geq": "≥",
      "\\neq": "≠",
      "\\approx": "≈",
    }

    Object.entries(symbols).forEach(([latexCmd, unicode]) => {
      result = result.replace(new RegExp(latexCmd.replace("\\", "\\\\"), "g"), unicode)
    })

    // Clean up remaining LaTeX commands
    result = result.replace(/\\[a-zA-Z]+/g, "")
    result = result.replace(/[{}]/g, "")

    return result
  }

  addIconToScene(canvas, originalLatex) {
    // Create unique texture key
    const textureKey = `latex-icon-${Date.now()}-${Math.random()}`
    this.textures.addCanvas(textureKey, canvas)

    // Calculate position
    const iconsPerRow = 5
    const iconSpacing = 140
    const startX = 80
    const startY = 400

    const col = this.iconCount % iconsPerRow
    const row = Math.floor(this.iconCount / iconsPerRow)
    const iconX = startX + col * iconSpacing
    const iconY = startY + row * 120

    // Create Phaser image
    const icon = this.add.image(iconX, iconY, textureKey)
    icon.setScale(0.6)
    icon.setInteractive()

    // Store original LaTeX
    icon.originalLatex = originalLatex

    // Entrance animation
    icon.setAlpha(0)
    icon.setScale(0)
    this.tweens.add({
      targets: icon,
      alpha: 1,
      scaleX: 0.6,
      scaleY: 0.6,
      duration: 500,
      ease: "Back.easeOut",
    })

    // Click handler
    icon.on("pointerdown", () => {
      this.showLatexPopup(icon, originalLatex)

      this.tweens.add({
        targets: icon,
        scaleX: 0.7,
        scaleY: 0.7,
        duration: 100,
        yoyo: true,
        ease: "Power2",
      })
    })

    // Hover effects
    icon.on("pointerover", () => {
      icon.setTint(0xffd700)
      this.tweens.add({
        targets: icon,
        scaleX: 0.65,
        scaleY: 0.65,
        duration: 150,
      })
    })

    icon.on("pointerout", () => {
      icon.clearTint()
      this.tweens.add({
        targets: icon,
        scaleX: 0.6,
        scaleY: 0.6,
        duration: 150,
      })
    })

    this.renderedIcons.push(icon)
    this.iconCount++

    this.showMessage("✅ Icon được tạo thành công!", "#10b981")
  }

  showLatexPopup(icon, latex) {
    // Tạo overlay mờ cho toàn màn hình
    const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
      .setOrigin(0)
      .setInteractive()
      .setDepth(100);
      
    // Tạo container cho popup
    const container = this.add.container(this.scale.width / 2, this.scale.height / 2)
      .setDepth(101);
    
    // Tạo nền cho popup
    const popupBg = this.add.rectangle(0, 0, 600, 500, 0x1e293b)
      .setStrokeStyle(2, 0x3b82f6)
      .setOrigin(0.5);
    container.add(popupBg);
    
    // Tiêu đề popup
    const title = this.add.text(0, -220, "Chi tiết đồ thị hàm số", {
      fontSize: "24px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);
    container.add(title);
    
    // Công thức LaTeX
    const formula = this.add.text(0, -170, `LaTeX: ${latex}`, {
      fontSize: "18px",
      color: "#94a3b8",
    }).setOrigin(0.5);
    container.add(formula);
    
    // Tạo canvas đồ thị
    const graphCanvas = document.createElement("canvas");
    graphCanvas.width = 500;
    graphCanvas.height = 300;
    
    // Vẽ đồ thị dựa trên loại biểu thức
    this.renderGraph(latex, graphCanvas);
    
    // Chuyển canvas thành texture
    const graphTextureKey = `popup-graph-${Date.now()}`;
    this.textures.addCanvas(graphTextureKey, graphCanvas);
    
    // Thêm đồ thị vào popup
    const graph = this.add.image(0, 0, graphTextureKey).setOrigin(0.5);
    container.add(graph);
    
    // Thêm nút đóng
    const closeBtn = this.add.rectangle(270, -220, 30, 30, 0xef4444)
      .setInteractive()
      .setOrigin(0.5);
    container.add(closeBtn);
    
    const closeText = this.add.text(270, -220, "X", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);
    container.add(closeText);
    
    // Thêm nút lưu (tùy chọn)
    const saveBtn = this.add.rectangle(0, 200, 200, 40, 0x10b981)
      .setInteractive()
      .setOrigin(0.5);
    container.add(saveBtn);
    
    const saveText = this.add.text(0, 200, "Đóng", {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);
    container.add(saveText);
    
    // Hiệu ứng xuất hiện
    container.setScale(0.5);
    container.setAlpha(0);
    
    this.tweens.add({
      targets: container,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
    
    // Xử lý sự kiện đóng popup
    const closePopup = () => {
      this.tweens.add({
        targets: container,
        scale: 0.5,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          container.destroy();
          overlay.destroy();
          this.textures.remove(graphTextureKey);
        }
      });
    };
    
    closeBtn.on('pointerdown', closePopup);
    saveBtn.on('pointerdown', closePopup);
    overlay.on('pointerdown', closePopup);
    
    // Hiệu ứng hover cho các nút
    closeBtn.on('pointerover', () => closeBtn.setScale(1.1));
    closeBtn.on('pointerout', () => closeBtn.setScale(1));
    saveBtn.on('pointerover', () => saveBtn.setScale(1.05));
    saveBtn.on('pointerout', () => saveBtn.setScale(1));
  }

  clearAllIcons() {
    if (this.renderedIcons.length === 0) {
      this.showMessage("⚠️ Không có icon nào để xóa!", "#f59e0b")
      return
    }

    this.renderedIcons.forEach((icon, index) => {
      this.tweens.add({
        targets: icon,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        rotation: Math.PI * 2,
        duration: 400,
        delay: index * 50,
        onComplete: () => {
          if (icon.texture && icon.texture.key.startsWith("latex-icon-")) {
            this.textures.remove(icon.texture.key)
          }
          icon.destroy()
        },
      })
    })

    this.renderedIcons = []
    this.iconCount = 0

    this.showMessage("🗑️ Đã xóa tất cả icons!", "#ef4444")
  }

  showMessage(text, color) {
    const message = this.add
      .text(400, 180, text, {
        fontSize: "16px",
        color: color,
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setAlpha(0)

    this.tweens.add({
      targets: message,
      alpha: 1,
      duration: 200,
      yoyo: true,
      hold: 1500,
      onComplete: () => message.destroy(),
    })
  }

  parseLatexToFunction(latex) {
    let expr = latex;
    
    // Replace LaTeX commands with JavaScript math expressions
    expr = expr.replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)");
    expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
    expr = expr.replace(/\^(\d+)/g, "^$1");
    
    // Các hàm lượng giác và hàm đặc biệt
    expr = expr.replace(/\\sin\(([^)]+)\)/g, "sin($1)");
    expr = expr.replace(/\\cos\(([^)]+)\)/g, "cos($1)");
    expr = expr.replace(/\\tan\(([^)]+)\)/g, "tan($1)");
    expr = expr.replace(/\\sin/g, "sin");
    expr = expr.replace(/\\cos/g, "cos");
    expr = expr.replace(/\\tan/g, "tan");
    expr = expr.replace(/\\log/g, "log10");
    expr = expr.replace(/\\ln/g, "log");
    expr = expr.replace(/\\exp/g, "exp");
    
    // Greek letters và symbols
    expr = expr.replace(/\\alpha/g, "a");
    expr = expr.replace(/\\beta/g, "b");
    expr = expr.replace(/\\gamma/g, "c");
    expr = expr.replace(/\\pi/g, "PI");
    expr = expr.replace(/\\times/g, "*");
    expr = expr.replace(/\\div/g, "/");
    
    // Replace x^2 + y^2 = r^2 with x^2 + y^2 - r^2
    if (expr.includes("=")) {
      const parts = expr.split("=");
      if (parts.length === 2) {
        expr = `${parts[0]} - (${parts[1]})`;
      }
    }
    
    // Clean up remaining LaTeX commands and braces
    expr = expr.replace(/\\[a-zA-Z]+/g, "");
    expr = expr.replace(/[{}]/g, "");
    
    try {
      // Thử phân tích biểu thức
      return parse(expr);
    } catch (err) {
      console.error("Không thể phân tích biểu thức:", err);
      return null;
    }
  }

  renderGraph(latex, canvas) {
    // Tạo canvas nếu không được cung cấp
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
    }
    
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    
    // Xóa canvas
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);
    
    // Vẽ hệ trục tọa độ
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    
    // Vẽ lưới
    ctx.beginPath();
    for (let i = 0; i <= width; i += 20) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
    }
    ctx.stroke();
    
    // Vẽ trục tọa độ
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    
    // Xác định loại biểu thức
    const expressionType = this.identifyExpressionType(latex);
    
    // Biểu thức mặc định để hiển thị làm đồ thị
    let defaultGraph = true;
    
    try {
      // Thiết lập tỉ lệ vẽ (scale)
      const xScale = 20; // Mỗi đơn vị x = 20px
      const yScale = 20; // Mỗi đơn vị y = 20px
      const xOffset = width / 2;
      const yOffset = height / 2;
      
      // Vẽ đồ thị dựa trên loại biểu thức
      switch (expressionType) {
        case 'circle':
          this.renderCircleGraph(latex, ctx, xOffset, yOffset, xScale);
          defaultGraph = false;
          break;
          
        case 'integral':
          this.renderIntegralGraph(ctx, width, height);
          defaultGraph = false;
          break;
          
        case 'sum':
          this.renderSumGraph(ctx, width, height);
          defaultGraph = false;
          break;
          
        case 'fraction':
          this.renderFractionGraph(ctx, width, height);
          defaultGraph = false;
          break;
          
        case 'greek':
          this.renderGreekGraph(ctx, width, height);
          defaultGraph = false;
          break;
          
        case 'sqrt':
          this.renderSqrtGraph(latex, ctx, width, height, xOffset, yOffset, xScale, yScale);
          defaultGraph = false;
          break;
          
        default:
          // Nếu không phù hợp với các kiểu trên, thử phân tích biểu thức
          const expr = this.parseLatexToFunction(latex);
          
          if (expr) {
            // Vẽ hàm số y = f(x) thông thường
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let isFirst = true;
            for (let px = 0; px < width; px++) {
              const x = (px - xOffset) / xScale;
              
              try {
                const result = evaluate(expr, { x });
                const y = -result; // Đảo dấu y vì trục y hướng xuống trong canvas
                const py = y * yScale + yOffset;
                
                if (isFirst) {
                  ctx.moveTo(px, py);
                  isFirst = false;
                } else {
                  ctx.lineTo(px, py);
                }
              } catch (e) {
                // Nếu có lỗi (ví dụ như chia cho 0), ngừng đường vẽ hiện tại
                isFirst = true;
              }
            }
            
            ctx.stroke();
            defaultGraph = false;
          }
      }
      
      if (defaultGraph) {
        // Nếu không thể vẽ đồ thị cụ thể, hiển thị biểu đồ mặc định
        ctx.font = "16px Arial";
        ctx.fillStyle = "#3b82f6";
        ctx.textAlign = "center";
        ctx.fillText("Hình minh họa biểu thức", width/2, height/2 - 40);
        
        // Vẽ một biểu tượng đại diện cho biểu thức
        ctx.font = "24px Arial";
        ctx.fillText("Σ ∫ √ π", width/2, height/2);
        
        ctx.font = "14px Arial";
        ctx.fillText("(Biểu thức phức tạp)", width/2, height/2 + 40);
      }
      
      // Vẽ nhãn trục
      ctx.font = "12px Arial";
      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "left";
      ctx.fillText("O", width/2 + 5, height/2 - 5);
      ctx.fillText("x", width - 10, height/2 - 5);
      ctx.fillText("y", width/2 + 5, 10);
      
      return canvas;
    } catch (err) {
      console.error("Lỗi khi vẽ đồ thị:", err);
      ctx.font = "16px Arial";
      ctx.fillStyle = "#ef4444";
      ctx.textAlign = "center";
      ctx.fillText("Lỗi khi vẽ đồ thị", width/2, height/2);
      return canvas;
    }
  }
  
  identifyExpressionType(latex) {
    if (latex.includes("x^2") && latex.includes("y^2") && latex.includes("=")) {
      return 'circle';
    } else if (latex.includes("\\int")) {
      return 'integral';
    } else if (latex.includes("\\sum")) {
      return 'sum';
    } else if (latex.includes("\\frac")) {
      return 'fraction';
    } else if (latex.includes("\\alpha") && latex.includes("\\beta") && latex.includes("\\gamma")) {
      return 'greek';
    } else if (latex.includes("\\sqrt")) {
      return 'sqrt';
    }
    return 'unknown';
  }
  
  renderCircleGraph(latex, ctx, xOffset, yOffset, xScale) {
    // Xử lý đặc biệt cho đường tròn
    let match = latex.match(/x\^2\s*\+\s*y\^2\s*=\s*(\d+)\^2/);
    let radius;
    
    if (match) {
      radius = parseInt(match[1]);
    } else {
      // Mặc định nếu không thể xác định bán kính
      radius = 4;
    }
    
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xOffset, yOffset, radius * xScale, 0, Math.PI * 2);
    ctx.stroke();
    
    // Vẽ đường kính và tên bán kính
    ctx.strokeStyle = "#64748b";
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(xOffset - radius * xScale, yOffset);
    ctx.lineTo(xOffset + radius * xScale, yOffset);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.moveTo(xOffset, yOffset);
    ctx.lineTo(xOffset + radius * xScale, yOffset);
    ctx.stroke();
    
    ctx.fillStyle = "#1e293b";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`r = ${radius}`, xOffset + radius * xScale / 2, yOffset - 10);
  }
  
  renderIntegralGraph(ctx, width, height) {
    // Vẽ đồ thị hàm e^-x
    const xOffset = width / 2;
    const yOffset = height / 2;
    const xScale = 40;
    const yScale = 40;
    
    // Vẽ đường cong e^-x
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let px = xOffset; px < width; px++) {
      const x = (px - xOffset) / xScale;
      const y = Math.exp(-x);
      const py = yOffset - y * yScale;
      
      if (px === xOffset) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    ctx.stroke();
    
    // Vẽ diện tích dưới đường cong
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    ctx.beginPath();
    ctx.moveTo(xOffset, yOffset);
    
    for (let px = xOffset; px < width; px++) {
      const x = (px - xOffset) / xScale;
      const y = Math.exp(-x);
      const py = yOffset - y * yScale;
      ctx.lineTo(px, py);
    }
    
    ctx.lineTo(width, yOffset);
    ctx.closePath();
    ctx.fill();
    
    // Nhãn hàm
    ctx.font = "14px Arial";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "left";
    ctx.fillText("e^-x", xOffset + 50, yOffset - 50);
    ctx.fillText("∫₀^∞ e^-x dx = 1", xOffset + 80, yOffset - 20);
  }
  
  renderSumGraph(ctx, width, height) {
    // Vẽ biểu đồ cột thể hiện tổng i^2
    const xOffset = width / 2 - 100;
    const yOffset = height / 2 + 80;
    const barWidth = 20;
    const barSpacing = 10;
    
    ctx.fillStyle = "#3b82f6";
    
    // Vẽ các cột thể hiện giá trị i^2 cho i từ 1 đến 5
    for (let i = 1; i <= 5; i++) {
      const value = i * i;
      const barHeight = Math.min(value * 10, 200);
      const x = xOffset + (i - 1) * (barWidth + barSpacing);
      const y = yOffset - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Nhãn giá trị
      ctx.font = "12px Arial";
      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "center";
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      
      // Nhãn chỉ số
      ctx.fillText(i.toString(), x + barWidth / 2, yOffset + 15);
    }
    
    // Công thức tổng
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("∑ i² = 1² + 2² + 3² + ...", width / 2, height / 2 - 100);
    
    // Thêm đường nối từ Sigma đến các cột
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2 - 90);
    ctx.lineTo(xOffset + 2 * (barWidth + barSpacing), height / 2 - 50);
    ctx.stroke();
  }
  
  renderFractionGraph(ctx, width, height) {
    // Vẽ biểu diễn phân số (a+b)/(c-d)
    const xOffset = width / 2;
    const yOffset = height / 2;
    
    // Vẽ hình chữ nhật biểu thị phân tử
    ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
    ctx.fillRect(xOffset - 80, yOffset - 80, 160, 40);
    
    // Vẽ hình chữ nhật biểu thị phân mẫu
    ctx.fillStyle = "rgba(239, 68, 68, 0.5)";
    ctx.fillRect(xOffset - 80, yOffset + 40, 160, 40);
    
    // Vẽ đường phân số
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xOffset - 100, yOffset);
    ctx.lineTo(xOffset + 100, yOffset);
    ctx.stroke();
    
    // Nhãn
    ctx.font = "16px Arial";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    
    // Tử số
    ctx.fillText("a + b", xOffset, yOffset - 55);
    
    // Mẫu số
    ctx.fillText("c - d", xOffset, yOffset + 65);
    
    // Minh họa phép chia
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Phép chia là phép tính", xOffset - 90, yOffset - 120);
    ctx.fillText("của hai đại lượng", xOffset - 90, yOffset - 100);
  }
  
  renderGreekGraph(ctx, width, height) {
    // Vẽ một tam giác thể hiện α + β = γ
    const xOffset = width / 2;
    const yOffset = height / 2;
    const triangleSize = 100;
    
    // Vẽ tam giác
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xOffset, yOffset - triangleSize);
    ctx.lineTo(xOffset - triangleSize, yOffset + triangleSize / 2);
    ctx.lineTo(xOffset + triangleSize, yOffset + triangleSize / 2);
    ctx.closePath();
    ctx.stroke();
    
    // Đánh dấu các góc
    ctx.fillStyle = "#3b82f6";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    
    // Góc α (góc trên)
    ctx.fillText("α", xOffset, yOffset - triangleSize - 10);
    
    // Góc β (góc trái)
    ctx.fillText("β", xOffset - triangleSize - 10, yOffset + triangleSize / 2);
    
    // Góc γ (góc phải)
    ctx.fillText("γ", xOffset + triangleSize + 10, yOffset + triangleSize / 2);
    
    // Công thức
    ctx.font = "18px Arial";
    ctx.fillStyle = "#1e293b";
    ctx.fillText("α + β = γ", xOffset, yOffset + triangleSize + 30);
  }
  
  renderSqrtGraph(latex, ctx, width, height, xOffset, yOffset, xScale, yScale) {
    // Vẽ đồ thị hàm căn bậc hai
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Xử lý hệ số nếu có
    let coefficient = 1;
    const coeffMatch = latex.match(/(\d+)\\sqrt/);
    if (coeffMatch) {
      coefficient = parseInt(coeffMatch[1]);
    }
    
    for (let px = xOffset; px < width; px++) {
      const x = (px - xOffset) / xScale;
      if (x >= 0) { // Chỉ vẽ với x dương
        const y = coefficient * Math.sqrt(x);
        const py = yOffset - y * yScale;
        
        if (px === xOffset) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    
    ctx.stroke();
    
    // Nhãn hàm
    ctx.font = "16px Arial";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    if (coefficient !== 1) {
      ctx.fillText(`f(x) = ${coefficient}√x`, xOffset + 100, yOffset - 80);
    } else {
      ctx.fillText("f(x) = √x", xOffset + 100, yOffset - 80);
    }
    
    // Đánh dấu điểm x=1, x=4
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    
    // Điểm (1, √1)
    const px1 = xOffset + 1 * xScale;
    const py1 = yOffset - coefficient * 1 * yScale;
    ctx.arc(px1, py1, 4, 0, Math.PI * 2);
    
    // Điểm (4, √4)
    const px4 = xOffset + 4 * xScale;
    const py4 = yOffset - coefficient * 2 * yScale;
    ctx.arc(px4, py4, 4, 0, Math.PI * 2);
    
    ctx.fill();
    
    // Nhãn điểm
    ctx.font = "12px Arial";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "left";
    ctx.fillText(`(1, ${coefficient})`, px1 + 5, py1 - 5);
    ctx.fillText(`(4, ${coefficient * 2})`, px4 + 5, py4 - 5);
  }
}
