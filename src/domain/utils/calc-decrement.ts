interface IRequest {
  balance: number
  bonus: number
  credits: number
  betAmount: number
}

export function calcDecrement({
  balance,
  bonus,
  credits,
  betAmount,
}: IRequest) {
  const decrements = {
    decrementOnBonus: 0,
    decrementOnBalance: 0,
    decrementOnCredits: 0,
  }

  let remainingAmount = betAmount

  if (balance > 0) {
    decrements.decrementOnBalance = -Math.min(balance, remainingAmount)
    remainingAmount -= Math.min(balance, remainingAmount)
  }

  if (remainingAmount > 0 && bonus > 0) {
    decrements.decrementOnBonus = -Math.min(bonus, remainingAmount)
    remainingAmount -= Math.min(bonus, remainingAmount)
  }

  if (remainingAmount > 0 && credits > 0) {
    decrements.decrementOnCredits = -Math.min(credits, remainingAmount)
  }

  return decrements
}
