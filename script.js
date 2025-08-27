class Calculator {
    constructor() {
        this.quantities = {
            'trivial': 0,
            'easy': 0,
            'medium': 0,
            'soul-prism': 0,
            'hard-plus': 0
        };
        
        this.baseValues = {
            'trivial': 500000,
            'easy': 600000,
            'medium': 700000,
            'soul-prism': 550000,
            'hard-plus': 900000
        };
        
        this.showInK = true;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateAllDisplays();
        this.updateSummary();
    }
    
    setupEventListeners() {
        // Botões de incremento e decremento
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const option = e.target.dataset.option;
                this.incrementQuantity(option);
            });
        });
        
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const option = e.target.dataset.option;
                this.decrementQuantity(option);
            });
        });
        
        // Toggle de visualização
        const displayToggle = document.getElementById('displayToggle');
        displayToggle.checked = this.showInK;
        displayToggle.addEventListener('change', (e) => {
            this.showInK = e.target.checked;
            this.updateAllDisplays();
            this.updateSummary();
        });
        
        // Input do Hard+
        const hardPlusInput = document.querySelector(".hard-plus .value-input");
        hardPlusInput.addEventListener("input", (e) => {
            let value = parseInt(e.target.value) || 0;
            if (value < 0) {
                value = 0;
                e.target.value = value;
            }
            this.baseValues["hard-plus"] = value;
            this.updateValueDisplay("hard-plus");
            this.updateSummary();
        });

        // Botão de copiar resumo
        const copyButton = document.getElementById("copySummary");
        copyButton.addEventListener("click", () => {
            this.copySummaryToClipboard();
        });
    }

    incrementQuantity(option) {
        this.quantities[option]++;
        this.updateQuantityDisplay(option);
        this.updateSummary();
    }

    decrementQuantity(option) {
        if (this.quantities[option] > 0) {
            this.quantities[option]--;
            this.updateQuantityDisplay(option);
            this.updateSummary();
        }
    }

    updateQuantityDisplay(option) {
        const card = document.querySelector(`[data-option="${option}"]`).closest(".option-card");
        const quantitySpan = card.querySelector(".quantity");
        quantitySpan.textContent = this.quantities[option];
    }

    updateValueDisplay(option) {
        const card = document.querySelector(`[data-option="${option}"]`).closest(".option-card");
        const valueDisplay = card.querySelector(".value-display");
        const baseValue = this.baseValues[option];

        valueDisplay.dataset.base = baseValue;
        valueDisplay.textContent = this.formatValue(baseValue);
    }

    updateAllDisplays() {
        Object.keys(this.baseValues).forEach(option => {
            this.updateValueDisplay(option);
            this.updateQuantityDisplay(option);
        });
    }

    formatValue(value) {
        if (this.showInK) {
            if (value >= 1000) {
                return (value / 1000).toLocaleString("pt-BR") + "K";
            }
            return value.toLocaleString("pt-BR");
        } else {
            return value.toLocaleString("pt-BR");
        }
    }

    updateSummary() {
        // Atualizar contadores individuais
        Object.keys(this.quantities).forEach(option => {
            const summaryElement = document.querySelector(`[data-summary="${option}"]`);
            summaryElement.textContent = this.quantities[option];
        });

        // Calcular totais
        const totalItems = Object.values(this.quantities).reduce((sum, qty) => sum + qty, 0);
        const totalValue = Object.keys(this.quantities).reduce((sum, option) => {
            return sum + (this.quantities[option] * this.baseValues[option]);
        }, 0);

        // Atualizar displays de total
        document.getElementById("totalItems").textContent = totalItems;
        document.getElementById("totalValue").textContent = this.formatValue(totalValue);
    }

    copySummaryToClipboard() {
        let summaryText = "Resumo das Seleções:\n";
        Object.keys(this.quantities).forEach(option => {
            summaryText += `${option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}: ${this.quantities[option]}\n`;
        });
        summaryText += `Total de Itens: ${document.getElementById("totalItems").textContent}\n`;
        summaryText += `Valor Total: ${document.getElementById("totalValue").textContent}`;

        navigator.clipboard.writeText(summaryText).then(() => {
            alert("Resumo copiado para a área de transferência!");
        }).catch(err => {
            console.error("Erro ao copiar: ", err);
            alert("Erro ao copiar o resumo.");
        });
    }
}

// Inicializar a calculadora quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
    new Calculator();
});

