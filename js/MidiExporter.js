import { Interpreter } from "./Interpreter.js";

export class MidiExporter {
    static createMidi(playbackQueue, bpm = 120) {
        // Verificar se MidiWriter está carregado
        if (typeof MidiWriter === 'undefined') {
            console.error('MidiWriter não está carregado!');
            return null;
        }

        const track = new MidiWriter.Track();
        
        // Configurar tempo
        track.setTempo(bpm);
        
        for (const item of playbackQueue) {
            if (typeof item === 'string') {
                if (item === 'REST') {
                    // Pausa - adicionar silêncio
                    track.addEvent(new MidiWriter.NoteEvent({
                        pitch: 'C4',
                        duration: '4',
                        velocity: 0 // Silêncio
                    }));
                } else if (item === "bpm-up") {
                        track.setTempo(bpm + 60);
                        continue;
                } else if (item === "bpm-down") {
                        track.setTempo(bpm - 60);
                        continue;
                } else if (item.length <= 3 && item !== 'REST') {
                    // É uma nota (ex: "A4", "C#5")
                    track.addEvent(new MidiWriter.NoteEvent({
                        pitch: item,
                        duration: '4', // Nota de 1/4
                        velocity: 80
                    }));
                }   
            } // Instrumentos são ignorados no MIDI básico
        }
        
        return new MidiWriter.Writer(track);
    }
    
    static downloadMidi(playbackQueue, filename = 'music.mid') {
        try {
            const writer = this.createMidi(playbackQueue, Interpreter.currentBPM);
            
            if (!writer) {
                alert('Erro: Biblioteca MIDI não carregada. Recarregue a página.');
                return;
            }
            
            // Gerar arquivo e fazer download
            const dataUri = writer.dataUri();
            
            const a = document.createElement('a');
            a.href = dataUri;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            console.log('MIDI baixado com sucesso:', filename);
        } catch (error) {
            console.error('Erro ao criar MIDI:', error);
            alert('Erro ao gerar arquivo MIDI: ' + error.message);
        }
    }
}