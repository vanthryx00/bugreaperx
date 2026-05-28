import '@testing-library/jest-dom'

// Mock scrollIntoView for JSDOM (used by ChatInterface, CollabEditor, and SprintEngine)
Element.prototype.scrollIntoView = () => {}
