
class EmailBuilder {
    constructor() {
        this.blocks = [];
        this.templates = [];
        this.currentEmail = [];
        this.editingBlockIndex = null;
        
        // FORCEER DEFAULT DATA
        this.initializeDefaultData();
        this.bindEvents();
        this.loadData();
    }

    initializeDefaultData() {
        console.log("📦 Creating default data...");
        
        // 10 VEELGEBRUIKTE ZINNEN
        const defaultBlocks = [
            { id: 1, text: "Beste [Naam],", category: "aanhef" },
            { id: 2, text: "Met vriendelijke groet,", category: "afsluiting" },
            { id: 3, text: "Hartelijk dank voor uw bericht.", category: "dank" },
            { id: 4, text: "We nemen zo spoedig mogelijk contact met u op.", category: "actie" },
            { id: 5, text: "Graag ontvang ik meer informatie over:", category: "vraag" },
            { id: 6, text: "Bij voorbaat dank voor uw medewerking.", category: "dank" },
            { id: 7, text: "Heeft u nog vragen? Laat het ons weten.", category: "vraag" },
            { id: 8, text: "We kijken uit naar onze samenwerking.", category: "samenwerking" },
            { id: 9, text: "U kunt ons bereiken op telefoonnummer [nummer].", category: "contact" },
            { id: 10, text: "Hoogachtend,", category: "afsluiting" }
        ];

        // 7 VOORBEELD TEMPLATES
        const defaultTemplates = [
            { 
                id: 1, 
                name: "Standaard Reactie", 
                content: [
                    "Beste [Naam],",
                    "Hartelijk dank voor uw bericht.",
                    "We nemen binnen 24 uur contact met u op.",
                    "Met vriendelijke groet,"
                ] 
            },
            { 
                id: 2, 
                name: "Offerte Aanvraag", 
                content: [
                    "Beste [Naam],",
                    "Bedankt voor uw interesse in onze diensten.",
                    "We sturen u binnen 2 werkdagen een offerte toe.",
                    "Heeft u nog vragen? Laat het ons weten.",
                    "Met vriendelijke groet,"
                ] 
            },
            { 
                id: 3, 
                name: "Factuur Herinnering", 
                content: [
                    "Beste [Naam],",
                    "Hierbij een vriendelijke herinnering voor openstaande factuur [factuurnummer].",
                    "Zou u de betaling zo spoedig mogelijk kunnen voldoen?",
                    "Bij voorbaat dank voor uw medewerking.",
                    "Met vriendelijke groet,"
                ] 
            },
            { 
                id: 4, 
                name: "Afspraak Bevestiging", 
                content: [
                    "Beste [Naam],",
                    "Hierbij bevestigen wij uw afspraak op [datum] om [tijd].",
                    "Locatie: [adres]",
                    "Mocht u verhinderd zijn, laat het ons tijdig weten.",
                    "We kijken uit naar ons gesprek!",
                    "Met vriendelijke groet,"
                ] 
            },
            { 
                id: 5, 
                name: "Klachtenafhandeling", 
                content: [
                    "Beste [Naam],",
                    "Hartelijk dank voor het melden van uw klacht.",
                    "Onze excuses voor het ongemak.",
                    "We doen ons uiterste best om dit op te lossen.",
                    "U hoort binnen 48 uur van ons.",
                    "Met vriendelijke groet,"
                ] 
            },
            { 
                id: 6, 
                name: "Samenwerking Voorstel", 
                content: [
                    "Beste [Naam],",
                    "Bedankt voor het gesprek van [datum].",
                    "We zijn enthousiast over de mogelijke samenwerking.",
                    "Bijgevoegd vindt u ons voorstel.",
                    "We kijken uit naar uw reactie.",
                    "Met vriendelijke groet,"
                ] 
            },
            { 
                id: 7, 
                name: "Vacature Reactie", 
                content: [
                    "Beste [Naam],",
                    "Hartelijk dank voor uw sollicitatie.",
                    "We hebben uw CV met interesse ontvangen.",
                    "U hoort binnen 5 werkdagen van ons.",
                    "Heeft u nog vragen? Laat het ons weten.",
                    "Met vriendelijke groet,"
                ] 
            }
        ];

        // FORCEER OPSLAAN
        localStorage.setItem('emailBlocks', JSON.stringify(defaultBlocks));
        localStorage.setItem('emailTemplates', JSON.stringify(defaultTemplates));
        
        console.log("✅ Default data created!");
        console.log("📝 Blocks:", defaultBlocks.length);
        console.log("🎨 Templates:", defaultTemplates.length);
    }

    loadData() {
        console.log("🔄 Loading data from localStorage...");
        
        // Laad data
        this.blocks = JSON.parse(localStorage.getItem('emailBlocks') || '[]');
        this.templates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
        
        console.log("📥 Loaded:", this.blocks.length, "blocks,", this.templates.length, "templates");
        
        // Toon data
        this.renderBlocks();
        this.renderTemplates();
        this.renderEmail();
    }

    saveData() {
        localStorage.setItem('emailBlocks', JSON.stringify(this.blocks));
        localStorage.setItem('emailTemplates', JSON.stringify(this.templates));
    }

    bindEvents() {
        document.getElementById('addBlockBtn').addEventListener('click', () => this.addBlock());
        document.getElementById('newBlockText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addBlock();
        });

        document.getElementById('templateSelector').addEventListener('change', (e) => this.loadTemplate(e.target.value));
        document.getElementById('saveTemplateBtn').addEventListener('click', () => this.showSaveTemplateModal());
        document.getElementById('confirmSaveBtn').addEventListener('click', () => this.saveTemplate());
        document.getElementById('cancelSaveBtn').addEventListener('click', () => this.hideSaveTemplateModal());

        document.getElementById('copyBtn').addEventListener('click', () => this.copyEmail());
        document.getElementById('clearCanvasBtn').addEventListener('click', () => this.clearCanvas());

        document.getElementById('saveTextBtn').addEventListener('click', () => this.saveEditedText());
        document.getElementById('cancelTextBtn').addEventListener('click', () => this.hideTextEditor());

        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const emailCanvas = document.getElementById('emailCanvas');
        
        emailCanvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            emailCanvas.classList.add('drag-over');
        });

        emailCanvas.addEventListener('dragleave', () => {
            emailCanvas.classList.remove('drag-over');
        });

        emailCanvas.addEventListener('drop', (e) => {
            e.preventDefault();
            emailCanvas.classList.remove('drag-over');
            
            const blockId = e.dataTransfer.getData('text/plain');
            this.addBlockToEmail(parseInt(blockId));
        });
    }

    renderBlocks() {
        const blocksList = document.getElementById('blocksList');
        blocksList.innerHTML = '';

        console.log("🎯 Rendering blocks:", this.blocks);

        this.blocks.forEach(block => {
            const blockElement = document.createElement('div');
            blockElement.className = 'block-item';
            blockElement.draggable = true;
            blockElement.textContent = block.text;
            blockElement.dataset.id = block.id;

            blockElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', block.id);
                blockElement.classList.add('dragging');
            });

            blockElement.addEventListener('dragend', () => {
                blockElement.classList.remove('dragging');
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '❌';
            deleteBtn.title = 'Verwijder zin';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteBlock(block.id);
            });

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'block-actions';
            actionsDiv.appendChild(deleteBtn);
            
            blockElement.appendChild(actionsDiv);
            blocksList.appendChild(blockElement);
        });
    }

    renderTemplates() {
        const templateSelector = document.getElementById('templateSelector');
        templateSelector.innerHTML = '<option value="">Kies een template...</option>';

        console.log("🎯 Rendering templates:", this.templates);

        this.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.id;
            option.textContent = template.name;
            templateSelector.appendChild(option);
        });
    }

    renderEmail() {
        const emailCanvas = document.getElementById('emailCanvas');
        
        if (this.currentEmail.length === 0) {
            emailCanvas.innerHTML = '<p class="empty-state">Sleep zinnen hierheen om je e-mail te bouwen</p>';
            return;
        }

        emailCanvas.innerHTML = '';
        
        this.currentEmail.forEach((block, index) => {
            const blockElement = document.createElement('div');
            blockElement.className = 'email-block';
            blockElement.textContent = block.text;

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.title = 'Bewerk tekst';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editBlockText(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '❌';
            deleteBtn.title = 'Verwijder van canvas';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeBlockFromEmail(index);
            });

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'block-actions';
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            
            blockElement.appendChild(actionsDiv);
            emailCanvas.appendChild(blockElement);
        });
    }

    addBlock() {
        const newBlockText = document.getElementById('newBlockText').value.trim();
        
        if (!newBlockText) {
            alert('Voer tekst in voor de nieuwe zin');
            return;
        }

        const newBlock = {
            id: Date.now(),
            text: newBlockText,
            category: 'custom'
        };

        this.blocks.push(newBlock);
        this.saveData();
        this.renderBlocks();
        
        document.getElementById('newBlockText').value = '';
    }

    deleteBlock(blockId) {
        if (confirm('Weet je zeker dat je deze zin wilt verwijderen?')) {
            this.blocks = this.blocks.filter(block => block.id !== blockId);
            this.saveData();
            this.renderBlocks();
        }
    }

    addBlockToEmail(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (block) {
            this.currentEmail.push({...block});
            this.renderEmail();
        }
    }

    removeBlockFromEmail(index) {
        this.currentEmail.splice(index, 1);
        this.renderEmail();
    }

    editBlockText(index) {
        this.editingBlockIndex = index;
        const currentText = this.currentEmail[index].text;
        
        document.getElementById('textEditor').value = currentText;
        document.getElementById('textEditorModal').style.display = 'block';
    }

    saveEditedText() {
        if (this.editingBlockIndex !== null) {
            const newText = document.getElementById('textEditor').value.trim();
            if (newText) {
                this.currentEmail[this.editingBlockIndex].text = newText;
                this.renderEmail();
            }
            this.hideTextEditor();
        }
    }

    hideTextEditor() {
        document.getElementById('textEditorModal').style.display = 'none';
        this.editingBlockIndex = null;
    }

    loadTemplate(templateId) {
        if (!templateId) return;

        const template = this.templates.find(t => t.id == templateId);
        if (template) {
            this.currentEmail = template.content.map(text => ({
                id: Date.now() + Math.random(),
                text: text,
                category: 'template'
            }));
            this.renderEmail();
        }
    }

    showSaveTemplateModal() {
        if (this.currentEmail.length === 0) {
            alert('Er is geen e-mail om op te slaan als template');
            return;
        }
        document.getElementById('saveTemplateModal').style.display = 'block';
    }

    hideSaveTemplateModal() {
        document.getElementById('saveTemplateModal').style.display = 'none';
        document.getElementById('templateName').value = '';
    }

    saveTemplate() {
        const templateName = document.getElementById('templateName').value.trim();
        
        if (!templateName) {
            alert('Voer een naam in voor het template');
            return;
        }

        const newTemplate = {
            id: Date.now(),
            name: templateName,
            content: this.currentEmail.map(block => block.text)
        };

        this.templates.push(newTemplate);
        this.saveData();
        this.renderTemplates();
        this.hideSaveTemplateModal();
        
        alert('Template opgeslagen!');
    }

    copyEmail() {
        if (this.currentEmail.length === 0) {
            alert('Er is geen e-mail om te kopiëren');
            return;
        }

        const emailText = this.currentEmail.map(block => block.text).join('\n\n');
        
        navigator.clipboard.writeText(emailText).then(() => {
            alert('✅ E-mail gekopieerd naar klembord!');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = emailText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ E-mail gekopieerd naar klembord!');
        });
    }

    clearCanvas() {
        if (confirm('Weet je zeker dat je het canvas wilt leegmaken?')) {
            this.currentEmail = [];
            this.renderEmail();
        }
    }
}

// Start de app
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Starting Email Builder...");
    new EmailBuilder();
});
