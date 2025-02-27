// Produktklasse
class Product {
    constructor(name, price, description) {
        this.id = Date.now().toString(); // Wie ein Namensschild für jedes Produkt
        this.name = name;
        this.price = parseFloat(price);
        this.description = description;
    }

    formatPrice() {
        return `${this.price.toFixed(2)} €`;
    }
}

// Produktverwaltungsklasse - Wie ein Spielleiter, der alles überwacht
class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
        this.initializeEventListeners();
        this.showWelcomeAnimation();
    }

    // 🎭 Willkommens-Animation - Wie wenn der Vorhang im Theater aufgeht
    showWelcomeAnimation() {
        // 🔍 Wir suchen die Überschrift (wie eine Schatzsuche!)
        const header = document.querySelector('.header');
        // 🎨 Wir machen sie erst unsichtbar
        header.style.opacity = '0';
        // ⏰ Warten einen kurzen Moment...
        setTimeout(() => {
            // ✨ ...und zaubern sie dann hervor!
            header.style.transition = 'opacity 1s ease-out';
            header.style.opacity = '1';
        }, 100);
    }

    // 🎮 Event Listener - Wie Knöpfe an einer Spielkonsole
    initializeEventListeners() {
        // 📝 Wir finden das Formular auf unserer Seite
        const form = document.getElementById('productForm');
        // 👂 Wir hören zu, ob jemand auf "Absenden" klickt
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stopp! Nicht die Seite neu laden
            this.addProductWithAnimation();
        });

        // 🖱️ Spezialeffekte für die Eingabefelder
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Wenn man draufklickt - wird es ein bisschen größer
            input.addEventListener('focus', () => {
                input.style.transition = 'all 0.3s ease';
                input.style.transform = 'scale(1.02)';
            });
            // Wenn man wegklickt - wird es wieder normal
            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
            });
        });
    }

    // 🎁 Neues Produkt hinzufügen - Wie ein neues Spielzeug auspacken
    async addProductWithAnimation() {
        // 📦 Wir sammeln alle Informationen über das neue Produkt
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;

        const product = new Product(name, price, description);
        
        // 🎈 Der Knopf macht "plopp"
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            submitBtn.style.transform = 'scale(1)';
        }, 150);

        await this.animateAddProduct(product);
        this.clearForm();
    }

    // ✨ Animation für neues Produkt - Wie ein Zaubertrick
    async animateAddProduct(product) {
        this.products.push(product);
        this.saveProducts();
        
        // 🎪 Wir bereiten die Bühne vor
        const tableBody = document.getElementById('productTableBody');
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        // 🎭 Wir dekorieren die neue Zeile
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.formatPrice()}</td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-danger" onclick="productManager.removeProductWithAnimation('${product.id}', this)">
                    Löschen
                </button>
            </td>
        `;
        
        // 🎬 Action! Die neue Zeile erscheint
        tableBody.insertBefore(row, tableBody.firstChild);
        await new Promise(resolve => setTimeout(resolve, 50));
        row.style.transition = 'all 0.5s ease-out';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }

    // Produkt mit Animation entfernen
    async removeProductWithAnimation(productId, button) {
        const row = button.closest('tr');
        
        // Animation für die Zeile
        row.style.transition = 'all 0.5s ease-out';
        row.style.opacity = '0';
        row.style.transform = 'translateX(100%)';
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.removeProduct(productId);
        this.displayProducts();
    }

    // Formular mit Animation zurücksetzen
    clearForm() {
        const form = document.getElementById('productForm');
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.style.transition = 'all 0.3s ease';
            input.style.transform = 'scale(0.98)';
        });
        
        setTimeout(() => {
            form.reset();
            inputs.forEach(input => {
                input.style.transform = 'scale(1)';
            });
        }, 300);
    }

    // Produkt hinzufügen
    addProduct() {
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;

        const product = new Product(name, price, description);
        this.products.push(product);
        this.saveProducts();
        this.displayProducts();
        this.clearForm();
    }

    // Produkt löschen
    removeProduct(productId) {
        this.products = this.products.filter(product => product.id !== productId);
        this.saveProducts();
        this.displayProducts();
    }

    // Produkte anzeigen
    displayProducts() {
        const tableBody = document.getElementById('productTableBody');
        tableBody.innerHTML = '';

        this.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.formatPrice()}</td>
                <td>${product.description}</td>
                <td>
                    <button class="btn btn-danger" onclick="productManager.removeProduct('${product.id}')">
                        Löschen
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Produkte im localStorage speichern
    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    // Produkte aus localStorage laden
    loadProducts() {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            const productsData = JSON.parse(savedProducts);
            this.products = productsData.map(data => {
                const product = new Product(data.name, data.price, data.description);
                product.id = data.id;
                return product;
            });
            this.displayProducts();
        }
    }
}

// Produktmanager initialisieren
const productManager = new ProductManager();
