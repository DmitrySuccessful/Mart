/**
 * Progress tracking functionality for courses and tests
 */

// Initialize progress tracking
function initProgressTracking() {
    // Update all progress bars on page load
    updateAllProgressBars();
    
    // Set up event listeners for progress updates
    setupProgressListeners();
}

// Update all progress bars on the page
function updateAllProgressBars() {
    // Update course progress bars
    document.querySelectorAll('.course-progress-bar').forEach(progressBar => {
        const courseId = progressBar.getAttribute('data-course-id');
        updateCourseProgressBar(courseId);
    });
    
    // Update test progress bars
    document.querySelectorAll('.test-progress-bar').forEach(progressBar => {
        const testId = progressBar.getAttribute('data-test-id');
        updateTestProgressBar(testId);
    });
}

// Update a specific course progress bar
function updateCourseProgressBar(courseId) {
    const course = courses[courseId];
    if (!course) return;
    
    // Calculate progress percentage
    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    // Update progress bar width
    const progressBar = document.querySelector(`.course-progress-bar[data-course-id="${courseId}"]`);
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
        
        // Update progress text
        const progressText = document.querySelector(`.course-progress-text[data-course-id="${courseId}"]`);
        if (progressText) {
            progressText.textContent = `${completedLessons}/${totalLessons} уроков (${Math.round(progressPercent)}%)`;
        }
    }
}

// Update a specific test progress bar
function updateTestProgressBar(testId) {
    const test = tests[testId];
    if (!test) return;
    
    // Get test result from user data
    const testResult = userData.testResults.find(result => result.testId === parseInt(testId));
    const progressPercent = testResult ? testResult.score : 0;
    
    // Update progress bar width
    const progressBar = document.querySelector(`.test-progress-bar[data-test-id="${testId}"]`);
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
        
        // Update progress text
        const progressText = document.querySelector(`.test-progress-text[data-test-id="${testId}"]`);
        if (progressText) {
            progressText.textContent = testResult ? `Результат: ${progressPercent}%` : 'Не пройден';
        }
    }
}

// Set up event listeners for progress updates
function setupProgressListeners() {
    // Listen for lesson completion events
    document.addEventListener('lessonCompleted', function(e) {
        if (e.detail && e.detail.courseId) {
            updateCourseProgressBar(e.detail.courseId);
        }
    });
    
    // Listen for test completion events
    document.addEventListener('testCompleted', function(e) {
        if (e.detail && e.detail.testId) {
            updateTestProgressBar(e.detail.testId);
        }
    });
}

// Mark a lesson as completed and trigger progress update
function markLessonCompleted(courseId, lessonId) {
    const course = courses[courseId];
    if (!course) return;
    
    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    // Mark as completed
    lesson.completed = true;
    
    // Add to user's completed lessons if not already there
    if (!userData.completedLessons.includes(`${courseId}-${lessonId}`)) {
        userData.completedLessons.push(`${courseId}-${lessonId}`);
        
        // Save user data
        saveUserData();
        
        // Dispatch event for progress update
        document.dispatchEvent(new CustomEvent('lessonCompleted', {
            detail: {
                courseId: courseId,
                lessonId: lessonId
            }
        }));
    }
}

// Save test result and trigger progress update
function saveTestResult(testId, score) {
    // Check if result already exists
    const existingResultIndex = userData.testResults.findIndex(r => r.testId === testId);
    
    if (existingResultIndex !== -1) {
        // Update existing result
        userData.testResults[existingResultIndex].score = score;
        userData.testResults[existingResultIndex].date = new Date().toISOString();
    } else {
        // Add new result
        userData.testResults.push({
            testId: testId,
            score: score,
            date: new Date().toISOString()
        });
    }
    
    // Save user data
    saveUserData();
    
    // Dispatch event for progress update
    document.dispatchEvent(new CustomEvent('testCompleted', {
        detail: {
            testId: testId,
            score: score
        }
    }));
}

// Calculate overall user progress
function calculateOverallProgress() {
    // Calculate course completion percentage
    let totalCourses = Object.keys(courses).length;
    let completedCourses = 0;
    
    for (const courseId in courses) {
        const course = courses[courseId];
        const totalLessons = course.lessons.length;
        const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
        
        // Consider a course completed if all lessons are completed
        if (totalLessons > 0 && completedLessons === totalLessons) {
            completedCourses++;
        }
    }
    
    // Calculate overall progress
    const overallProgress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
    
    return {
        overallProgress: Math.round(overallProgress),
        completedCourses: completedCourses,
        totalCourses: totalCourses
    };
}

// Update profile progress display
function updateProfileProgress() {
    const progress = calculateOverallProgress();
    
    // Update overall progress bar
    const overallProgressBar = document.querySelector('.overall-progress-bar');
    if (overallProgressBar) {
        overallProgressBar.style.width = `${progress.overallProgress}%`;
    }
    
    // Update progress text
    const overallProgressText = document.querySelector('.overall-progress-text');
    if (overallProgressText) {
        overallProgressText.textContent = `${progress.overallProgress}% завершено`;
    }
    
    // Update courses completed text
    const coursesCompletedText = document.querySelector('.courses-completed-text');
    if (coursesCompletedText) {
        coursesCompletedText.textContent = `${progress.completedCourses}/${progress.totalCourses} курсов завершено`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initProgressTracking();
});
