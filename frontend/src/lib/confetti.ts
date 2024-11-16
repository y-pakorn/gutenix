import confetti from "canvas-confetti"

export const fireConfettiSide = () => {
  const end = Date.now() + 0.5 * 1000
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

  const frame = () => {
    if (Date.now() > end) return

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    })

    requestAnimationFrame(frame)
  }

  frame()
}

export const fireSadEmojiAbove = () => {
  const end = Date.now() + 0.2 * 1000
  const sad = confetti.shapeFromText({ text: "😢", scalar: 2 })
  const angry = confetti.shapeFromText({ text: "😡", scalar: 2 })

  const frame = () => {
    if (Date.now() > end) return

    confetti({
      shapes: [sad, angry],
      scalar: 3,
      spread: 180,
      particleCount: 1,
      origin: { y: -0.2 },
      startVelocity: -35,
    })

    requestAnimationFrame(frame)
  }

  frame()
}
