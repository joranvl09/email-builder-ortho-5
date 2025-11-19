class EmailBuilder {
    constructor() {
        this.blocks = [];
        this.templates = [];
        this.currentEmail = [];
        this.editingBlockIndex = null;
        this.draggedBlockIndex = null;
        
        this.initializeDefaultData();
        this.bindEvents();
        this.loadData();
    }

    initializeDefaultData() {
        const defaultBlocks = [
            { 
                id: 1, 
                text: "Aanhef:\nBeste [Klantnaam],\n\n", 
                category: "aanhef" 
            },
            { 
                id: 2, 
                text: "Afsluiting:\nMet vriendelijke groet,\n\nHet team van Orto", 
                category: "afsluiting" 
            },
            { 
                id: 3, 
                text: "Contact:\nTelefoon: [Telefoonnummer]\nE-mail: [E-mailadres]", 
                category: "contact" 
            },
            { 
                id: 4, 
                text: "Afspraak bevestiging:\nUw afspraak is bevestigd op [Datum] om [Tijd].", 
                category: "afspraak" 
            },
            { 
                id: 5, 
                text: "Locatie:\nOnze locatie: [Adres]\nGelieve 10 minuten eerder aanwezig te zijn.", 
                category: "locatie" 
            },
            { 
                id: 6, 
                text: "Annulering:\nMocht u verhinderd zijn, gelieve dit 24 uur van tevoren door te geven.", 
                category: "annulering" 
            },
            { 
                id: 7, 
                text: "Feedback vraag:\nHoe ervaart u uw herstel tot nu toe?", 
                category: "feedback" 
            },
            { 
                id: 8, 
                text: "Nazorg:\nHet is belangrijk om nazorgafspraken of controles bij te wonen.", 
                category: "nazorg" 
            }
        ];

        const defaultTemplates = [
            { 
                id: 1, 
                name: "Afspraak Bevestiging",
                content: [
                    "Beste [Klantnaam],\n\nWij willen u graag informeren dat uw afspraak bij Orto is bevestigd op [Datum] om [Tijd]. De afspraak vindt plaats op onze locatie aan [Adres]. Gelieve bij aankomst ongeveer 10 minuten eerder aanwezig te zijn, zodat wij u rustig kunnen inchecken en de administratie kunnen afronden.\n\nWat u kunt verwachten tijdens uw bezoek:\n\n• Een korte intake door een van onze specialisten\n• Eventuele metingen of onderzoeken die nodig zijn voor uw behandeling\n• Bespreking van uw behandelplan en eventuele vervolgafspraken\n\nIndien u speciale wensen of vragen heeft over uw behandeling, laat het ons gerust weten voor uw afspraak. U kunt ons bereiken via [Telefoonnummer] of [E-mailadres].\n\nMocht u verhinderd zijn, vragen wij u vriendelijk dit uiterlijk 24 uur voor de afspraak aan ons door te geven, zodat wij een nieuwe afspraak voor u kunnen plannen. Dit helpt ons om onze planning efficiënt te houden en andere klanten ook optimaal te kunnen bedienen.\n\nWij kijken ernaar uit u te verwelkomen en u te helpen met uw behandeling.",
                    "Met vriendelijke groet,\n\nHet team van Orto"
                ]
            },
            { 
                id: 2, 
                name: "Nazorg en Feedback",
                content: [
                    "Beste [Klantnaam],\n\nWij hopen dat uw behandeling bij Orto goed is verlopen en dat u tevreden bent met het resultaat. Ons doel is om ervoor te zorgen dat u zich volledig ondersteund voelt, niet alleen tijdens de behandeling, maar ook in de periode erna.\n\nOm u optimaal te begeleiden, willen wij graag uw feedback ontvangen over het volgende:\n\n• Hoe ervaart u uw herstel tot nu toe?\n• Heeft u nog vragen over de oefeningen, instructies of materialen die u heeft gekregen?\n• Zijn er problemen of ongemakken die wij voor u kunnen oplossen?\n\nDaarnaast willen wij u eraan herinneren dat het belangrijk is om eventuele nazorgafspraken of controles bij te wonen. Dit helpt ons om uw herstel goed te monitoren en bij te sturen waar nodig.\n\nIndien u aanvullende ondersteuning nodig heeft, kunt u contact opnemen via [Telefoonnummer] of [E-mailadres]. Wij staan altijd klaar om uw vragen te beantwoorden en u verder te helpen.\n\nWij waarderen uw vertrouwen in Orto en kijken ernaar uit om u te blijven ondersteunen bij uw herstel en welzijn.",
                    "Met vriendelijke groet,\n\nHet team van Orto"
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
        
        // Drop zone voor nieuwe blokken
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
            if (blockId.startsWith('block-')) {
                // Bestaand blok verslepen
                const fromIndex = parseInt(blockId.split('-')[1]);
                const toIndex = this.getDropIndex(e);
                this.moveBlock(fromIndex, toIndex);
            } else {
                // Nieuw blok toevoegen
                this.addBlockToEmail(parseInt(blockId));
            }
        });
    }

    getDropIndex(e) {
        const emailCanvas = document.getElementById('emailCanvas');
        const blocks = emailCanvas.querySelectorAll('.email-block');
        const canvasRect = emailCanvas.getBoundingClientRect();
        const y = e.clientY - canvasRect.top;

        for (let i = 0; i < blocks.length; i++) {
            const blockRect = blocks[i].getBoundingClientRect();
            const blockTop = blockRect.top - canvasRect.top;
            const blockMiddle = blockTop + (blockRect.height / 2);

            if (y < blockMiddle) {
                return i;
            }
        }
        return blocks.length;
    }

    moveBlock(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        const block = this.currentEmail.splice(fromIndex, 1)[0];
        this.currentEmail.splice(toIndex, 0, block);
        this.renderEmail();
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
                e.dataTransfer.setData('text/plain', block.id.toString());
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
            blockElement.draggable = true;
            blockElement.textContent = block.text;
            blockElement.dataset.index = index;

            blockElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', `block-${index}`);
                blockElement.classList.add('dragging');
            });

            blockElement.addEventListener('dragend', () => {
                blockElement.classList.remove('dragging');
            });

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
