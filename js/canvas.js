const canvas = document.querySelector('canvas');

var heightRatio = 1;
canvas.height = canvas.width * heightRatio;

const canvasCreator = () => {
        // let heightRatio = 1;
        // canvas.height = canvas.width * heightRatio;
        let pincel = canvas.getContext("2d");
        pincel.beginPath();
        pincel.strokeStyle = '#0A3871';
        pincel.lineWidth = 10;
    
        const drawLine = (fromX, fromY, toX, toY) => {
            pincel.moveTo(fromX, fromY);
            pincel.lineTo(toX, toY);
            pincel.stroke();
        }
    
        const initialDrawing = () => {
            pincel.clearRect(0, 0, pincel.canvas.width, pincel.canvas.height);
            drawLine(0, 298, 300, 298);
            drawLine(50, 300, 50, 15);
            drawLine(45, 15, 200, 15);
            drawLine(200, 10, 200, 70);
        }
        const head = () => {
            pincel.beginPath(),
            pincel.arc(200, 100, 35, 0, Math.PI * 2, true );
            pincel.stroke();
        }
        const body = () => {
            drawLine(200, 130, 200, 230);
        }
        const leftLeg = () => {
            drawLine(200, 225, 170, 260)
        }
        const rightLeg = () => {
            drawLine(200, 225, 230, 260)
        }
        const leftArm = () => {
            drawLine(200, 150, 170, 180)
        }
        const rightArm = () => {
            drawLine(200, 150, 230, 180)
        }
    
        return {initialDrawing, head, body, leftLeg, rightLeg, leftArm, rightArm};
    }
    
    const drawMan = (count) => {
        const { head, body, leftLeg, rightLeg, leftArm, rightArm } = canvasCreator();
        switch (count) {
            case 1:
                head();
                break;
            case 2:
                body();
                break;
            case 3:
                leftArm();
                break;
            case 4:
                rightArm();
                break;
            case 5:
                leftLeg();
                break;
            case 6:
                rightLeg();
                break;
            default:
                break;
        }
    }

    //module.export = canvasCreator();
    export {canvasCreator, drawMan};