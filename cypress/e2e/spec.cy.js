describe('home', () => {
  it('Tool Analysis Video',() => {
   
    //cy.visit('http://localhost:9000/popup.html#/app/tools/analysis')
    cy.get(':nth-child(1) > .mui-0 > .mui-19midj6').click()
    cy.url().should('include', 'app/tools/analysis')
    //Test Youtube
    cy.get('[data-testid="analysis_video_input"]').type("https://www.youtube.com/watch?v=WaaL75G0qu0")
    cy.get('[data-testid="analysis_video_submit"]').click()
    //Test results
    cy.get('[data-testid="analysis-yt-result"]').should('be.visible')
    cy.get('[data-testid="CancelIcon"]').click()
    cy.get('[data-testid="analysis-yt-result"]').should('not.exist')

    //Test Twitter
    cy.get('[data-testid="analysis_video_input"]').type("https://twitter.com/olex_scherba/status/1505991194018557955")
    cy.get('[data-testid="analysis_video_submit"]').click()
    cy.get('[data-testid="analysis-tw-result"]').should('be.visible')
    
  })


})
