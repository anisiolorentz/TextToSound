export class Volume {
    static currentVolume = 1; // (limitado de 0 a 2)

    static up() {
        this.currentVolume += 0.2;
        this.currentVolume = Math.min(this.currentVolume, 2); 
        this.updateVolumeDisplay();
        console.log(`Volume aumentado para: ${this.currentVolume}`);
    }

    static down() {
        this.currentVolume -= 0.2;
        this.currentVolume = Math.max(this.currentVolume, 0.0);
        this.updateVolumeDisplay();
        console.log(`Volume diminuído para: ${this.currentVolume}`);
    }

    static double() {
        if (this.currentVolume === 0.0) {
            this.currentVolume = 0.0625;
        }
        this.currentVolume = Math.min(this.currentVolume * 2, 2.0);
        this.updateVolumeDisplay();
        console.log(`Volume dobrado para: ${this.currentVolume}dB`);
    }

    static default() {
        this.currentVolume = 1;
        this.updateVolumeDisplay();
    }
    
    static getCurrentVolume() {
        return this.currentVolume;
    }

    static updateVolumeDisplay() {
        const volumeValue = document.querySelector(".volume-value");
        if (volumeValue) {
            const percentage = Math.round(Volume.getCurrentVolume() * 50);
            volumeValue.innerHTML = `${percentage}%`;
        }
    }
}