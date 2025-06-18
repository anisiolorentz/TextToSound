export class Note {
    static A = ["A1", "A2", "A3", "A4", "A5", "A6", "A7"];
    static B = ["B1", "B2", "B3", "B4", "B5", "B6", "B7"];
    static C = ["C1", "C2", "C3", "C4", "C5", "C6", "C7"];
    static D = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"];
    static E = ["E1", "E2", "E3", "E4", "E5", "E6", "E7"];
    static F = ["F1", "F2", "F3", "F4", "F5", "F6", "F7"];
    static G = ["G1", "G2", "G3", "G4", "G5", "G6", "G7"];

    static currentNote;
    static currentOctave = 3; // quarta oitava

    static getNote() {
        return this.currentNote[this.currentOctave];
    }

    static increaseOctave() {
        if (this.currentOctave > 7) {
            return this.currentNote[7]
        }
        return this.currentNote[this.currentOctave + 1];
    }

    static descreaseOctave() {
        if (this.currentOctave < 0) {
            return this.currentNote[0];
        }
        return this.currentNote[this.currentOctave - 1];
    }

    static setCurrentNote(note) {
        this.currentNote = note;
    }

    static setCurrentOctave(octave) {
        this.currentOctave = octave;
    }
}