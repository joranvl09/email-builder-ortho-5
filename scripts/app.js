class EmailBuilder {
    constructor() {
        this.blocks = [];
        this.templates = [];
        this.currentEmail = [];
        this.editingBlockIndex = null;
        
        this.initializeDefaultData();
        this.bindEvents();
        this.loadData();
    }

    initializeDefaultData() {
        const defaultBlocks = [
            { 
                id: 1, 
                text: "Aanhef:\nBeste meneer/mevrouw,\n\n", 
                category: "aanhef" 
            },
            { 
                id: 2, 
                text: "Afsluiting:\nMet vriendelijke groet,\nHet Team Ortho Care", 
                category: "afsluiting" 
            },
            { 
                id: 3, 
                text: "Contact:\nTelefoon: 010-1234567\nE-mail: info@orthocare.nl", 
                category: "contact" 
            },
            { 
                id: 4, 
                text: "Bevestiging:\nHartelijk dank voor uw aanvraag. Wij hebben alle informatie goed ontvangen.", 
                category: "dank" 
            },
            { 
                id: 5, 
                text: "Afspraak:\nWe nemen binnen twee werkdagen contact met u op voor een afspraak.", 
                category: "afspraak" 
            },
            { 
                id: 6, 
                text: "Kosten:\nTijdens het gesprek lichten we de kosten en planning uitgebreid toe.", 
                category: "kosten" 
            },
            { 
                id: 7, 
                text: "Vragen:\nHeeft u nog vragen vooraf? Laat het ons vooral weten.", 
                category: "vragen" 
            },
            { 
                id: 8, 
                text: "Samenwerking:\nWe kijken uit naar onze samenwerking en hopen u snel te mogen helpen.", 
                category: "samenwerking" 
            },
            { 
                id: 9, 
                text: "Onderwerp:\nBetreft: Offerte aanvraag orthopedische zorg", 
                category: "onderwerp" 
            },
            { 
                id: 10, 
                text: "Verwijzing:\nNaar aanleiding van uw verwijzing van huisarts Dr. Jansen...", 
                category: "verwijzing" 
            }
        ];

        const defaultTemplates = [
            { 
                id: 1, 
                name: "Standaard Reactie",
                content: [
                    "Beste meneer/mevrouw,\n\nHartelijk dank voor uw bericht. Wij hebben uw vraag ontvangen en nemen binnen 24 uur contact met u op.\n\nMet vriendelijke groet,\nHet Team Ortho Care\n\nTelefoon: 010-1234567\nE-mail: info@orthocare.nl"
                ]
            },
            { 
                id: 2, 
                name: "Offerte Aanvraag",
                content: [
                    "Beste meneer/mevrouw,\n\nBedankt voor uw interesse in onze orthopedische diensten. We hebben uw aanvraag ontvangen en gaan hier graag verder op in.",
                    "Tijdens een persoonlijk gesprek bespreken we uw specifieke situatie, wensen en mogelijkheden. We lichten dan ook de kosten en planning uitgebreid toe.",
                    "We nemen binnen twee werkdagen contact met u op om een afspraak in te plannen. Heeft u vooraf nog vragen? Laat het ons weten.\n\nMet vriendelijke groet,\nHet Team Ortho Care"
                ]
            },
            { 
                id: 3, 
                name: "Afspraak Bevestiging",
                content: [
                    "Beste meneer/mevrouw,\n\nHierbij bevestigen wij uw afspraak op [datum] om [tijd] uur.\nLocatie: Ortho Care Centrum, Hoofdstraat 123, Rotterdam",
                    "Tijdens de afspraak bespreken we uw situatie en maken we een behandelplan op maat. Graag vragen wij u eventuele medische gegevens en verwijsbrief mee te nemen.",
                    "Mocht u verhinderd zijn, laat het ons dan minimaal 24 uur van tevoren weten zodat we de afspraak kunnen verplaatsen.\n\nWe kijken uit naar uw komst!\n\nMet vriendelijke groet,\nHet Team Ortho Care"
                ]
            },
            { 
                id: 4, 
                name: "Factuur Herinnering",
                content: [
                    "Beste meneer/mevrouw,\n\nHierbij een vriendelijke herinnering voor de openstaande factuur met nummer [factuurnummer] met een totaalbedrag van € [bedrag].",
                    "Zou u de betaling zo spoedig mogelijk willen voldoen? Indien u de factuur reeds heeft betaald, kunt u deze herinnering als niet verzonden beschouwen.",
                    "Voor vragen over deze factuur kunt u contact opnemen met onze administratie via telefoonnummer 010-1234567 of per e-mail: admin@orthocare.nl\n\nBij voorbaat dank voor uw medewerking."
                ]
            },
            { 
                id: 5, 
                name: "Klachtenafhandeling",
                content: [
                    "Geachte heer/mevrouw,\n\nHartelijk dank voor het melden van uw klacht. Onze excuses voor het ongemak dat u heeft ervaren.",
                    "We nemen uw feedback zeer serieus en doen ons uiterste best om een passende oplossing te vinden voor uw situatie.",
                    "U hoort binnen 48 uur van onze klantenservice coördinator. Mocht u in de tussentijd vragen hebben, dan kunt u terecht bij [naam contactpersoon].\n\nMet vriendelijke groet,\nHet Management Ortho Care"
                ]
            },
            { 
                id: 6, 
                name: "Samenwerking Voorstel",
                content: [
                    "Beste [Naam],\n\nBedankt voor het waardevolle gesprek van [datum]. We zijn enthousiast over de mogelijke samenwerking.",
                    "Bijgevoegd vindt u ons uitgebreide voorstel met daarin onze aanpak, planning en investering. We zijn ervan overtuigd dat we u optimaal kunnen ondersteunen.",
                    "We kijken uit naar uw reactie en hopen snel van u te horen. Voor vragen staat ons team uiteraard graag voor u klaar.\n\nMet vriendelijke groet,\n[Je Naam]\nOrtho Care Specialist"
                ]
            },
            { 
                id: 7, 
                name: "Vacature Reactie",
                content: [
                    "Beste meneer/mevrouw,\n\nHartelijk dank voor uw sollicitatie op de functie van Orthopedisch Medewerker. We hebben uw CV en motivatie met interesse ontvangen.",
                    "Uw profiel sluit goed aan bij onze zoektocht. We nodigen u graag uit voor een kennismakingsgesprek in week [weeknummer].",
                    "U hoort binnen 5 werkdagen van ons voor het inplannen van een gesprek. Heeft u vragen vooraf? Neem dan contact op met onze HR afdeling.\n\nMet vriendelijke groet,\nHet Werving & Selectie Team"
                ]
            }
        ];

        localStorage.setItem('emailBlocks', JSON.stringify(defaultBlocks));
        localStorage.setItem('emailTemplates', JSON.stringify(defaultTemplates));
    }

    loadData() {
        this.blocks = JSON.parse(localStorage.getItem('emailBlocks') || '[]');
        this.templates = JSON.parse(localStorage.getItem('emailTemplates') || '[]');
        
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
            deleteBtn.title = 'Verwijder blok';
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
        templateSelector.innerHTML = '<option value="">Kies template...</option>';

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
            emailCanvas.innerHTML = '<p class="empty-state">Sleep blokken hierheen om je e-mail te bouwen</p>';
            return;
        }

        emailCanvas.innerHTML = '';
        
        this.currentEmail.forEach((block, index) => {
            const blockElement = document.createElement('div');
            blockElement.className = 'email-block';
            blockElement.textContent = block.text;

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️ Bewerk';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editBlockText(index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '❌ Verwijder';
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
            alert('Voer tekst in voor het nieuwe blok');
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
        if (confirm('Weet je zeker dat je dit blok wilt verwijderen?')) {
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

document.addEventListener('DOMContentLoaded', () => {
    new EmailBuilder();
});
