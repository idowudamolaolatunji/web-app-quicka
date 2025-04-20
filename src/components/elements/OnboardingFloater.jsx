import React from 'react'

export default function OnboardingFloater() {
    const stepsToComplete = JSON.parse(localStorage.getItem(STEPS_PROGRESS))

    function calculateCompletionPercentage(arr) {
        const totalTasks = arr.length;
        const completedTasks = arr.filter(task => task.completed).length;
        const percentage = (completedTasks / totalTasks) * 100;
        return `${percentage}% completed`;
    }

  return (
    <div>
      onboarding <span>{calculateCompletionPercentage(stepsToComplete)}%</span> 
    </div>
  )
}
