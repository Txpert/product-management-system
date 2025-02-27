// Produktklasse
class Product {
    constructor(name, price, description) {
        this.id = Date.now().toString(); // Eindeutige ID für jedes Produkt
        this.name = name;
        this.price = parseFloat(price);
        this.description = description;
    }

    formatPrice() {
        return `${this.price.toFixed(2)} €`;
    }
}

// Produktverwaltungsklasse
class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
        this.initializeEventListeners();
        this.showWelcomeAnimation();
    }

    // Willkommens-Animation
    showWelcomeAnimation() {
        const header = document.querySelector('.header');
        header.style.opacity = '0';
        setTimeout(() => {
            header.style.transition = 'opacity 1s ease-out';
            header.style.opacity = '1';
        }, 100);
    }

    // Event Listener initialisieren
    initializeEventListeners() {
        const form = document.getElementById('productForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProductWithAnimation();
        });

        // Hover-Effekte für Formularfelder
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transition = 'all 0.3s ease';
                input.style.transform = 'scale(1.02)';
            });
            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
            });
        });
    }

    // Produkt mit Animation hinzufügen
    async addProductWithAnimation() {
        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;

        const product = new Product(name, price, description);
        
        // Animation für den Submit-Button
        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            submitBtn.style.transform = 'scale(1)';
        }, 150);

        // Produkt mit Verzögerung hinzufügen
        await this.animateAddProduct(product);
        
        this.clearForm();
    }

    // Animation beim Hinzufügen eines Produkts
    async animateAddProduct(product) {
        this.products.push(product);
        this.saveProducts();
        
        const tableBody = document.getElementById('productTableBody');
        const row = document.createElement('tr');
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
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
        
        tableBody.insertBefore(row, tableBody.firstChild);
        
        // Animation abspielen
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
