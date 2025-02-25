document.getElementById("calculate").addEventListener("click", function() {
    let power = parseFloat(document.getElementById("power").value);
    let powerUnit = document.getElementById("power-unit").value;
    let minor = parseFloat(document.getElementById("minor").value);
    let minorUnit = document.getElementById("minor-unit").value;
    let major = parseFloat(document.getElementById("major").value);
    let majorUnit = document.getElementById("major-unit").value;
    let rate = parseFloat(document.getElementById("rate").value);
    let rateUnit = document.getElementById("rate-unit").value;

   
    if (powerUnit === "mW") {
        power = power / 1000;
    }


    if (minorUnit === "µm") {
        minor = minor / 1e6;
    } else {
        minor = minor / 1000;
    }

    if (majorUnit === "µm") {
        major = major / 1e6;
    } else {
        major = major / 1000;
    }

    
    if (rateUnit === "kHz") {
        rate = rate * 1e3;
    } else {
        rate = rate * 1e6;
    }

   
    let energyPerPulse = power / rate; 
    let energyPerPulse_nJ = energyPerPulse * 1e9;
    let beamArea_m2 = Math.PI * (minor / 2) * (major / 2);

    let beamArea_um2 = beamArea_m2 * 1e12;
  
    let beamArea_cm2 = beamArea_m2 * 1e4;

    let fluence = (energyPerPulse / beamArea_cm2) * 1e6;

    document.getElementById("result").innerHTML = `
        <strong>Energy per pulse:</strong> ${energyPerPulse_nJ.toFixed(3)} nJ <br>
        <strong>Beam area:</strong> ${beamArea_um2.toExponential(3)} µm² (${beamArea_cm2.toExponential(3)} cm²) <br>
        <strong>Fluence:</strong> ${fluence.toFixed(3)} µJ/cm²
    `;

    
    drawBeamShape(minor * 1e6, major * 1e6);
});

function drawBeamShape(minor, major) {
    let canvas = document.getElementById("beamCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;


    let scaleFactor = 0.3; 
    let ellipseWidth = major * scaleFactor;
    let ellipseHeight = minor * scaleFactor;


    ctx.beginPath();
    ctx.ellipse(centerX, centerY, ellipseWidth / 2, ellipseHeight / 2, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

  
    ctx.beginPath();
    ctx.moveTo(centerX - ellipseWidth / 2, centerY);
    ctx.lineTo(centerX + ellipseWidth / 2, centerY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1.5;
    ctx.stroke();


    ctx.beginPath();
    ctx.moveTo(centerX, centerY - ellipseHeight / 2);
    ctx.lineTo(centerX, centerY + ellipseHeight / 2);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "14px Arial";
    ctx.textAlign = "left";

    ctx.fillStyle = "red";
    ctx.fillText(`Major Axis: ${major.toFixed(1)} µm`, centerX + 10, centerY - 10);

    ctx.fillStyle = "green";
    ctx.fillText(`Minor Axis: ${minor.toFixed(1)} µm`, centerX + 10, centerY + 20);
}
