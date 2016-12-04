# OneQuestion-API

---

- [BACK] POST /create (question, email, firstname) => {

  //Generate owner_shortcode
  //Generate share_shortcode
  CREATE QUESTION(question)
   => (id from Question), owner_shortcode, share_shortcode, question
    CREATE Owner
      => (id from Owner), owner_shortcode, question_id, firstname, email

      RETURN on /created
          sendEmail: creation de question
          ctx.body = {
            owner_shortcode,
            share_shortcode
          }      
}

---

- [FRONT] ctx.body received, redirection /created/:owner_shortcode/:share_shortcode
    => Render a page FRONT
      with 2 links


        - /question/:share_shortcode/ -> (QUAND TU CLICK)
          GET /question/:share_shortcode (en back getQuestion(:share_shortcode) => question(+owner)(responses(contributor)))
            Render all this things
            + 3 inputs
            Un textarea: Response
            Un input: firstname
            Un input: email
            + button send

            onClick send => POST /question/:share_shortcode (response, firstname, email) => {
              ctx.params.share_shortcode =>Recupérer la question
                // Generate contributor_shortcode
                CREATE Response(response, contributor_shortcode, question_id)
                  => (id from response)
                  CREATE Contributor(firstname, email, contributor_shortcode, response_id)
                    => (id from contributor)
              return contributor_shortcode;
            }


        - /question/:mixed_shortcode/admin -> (QUAND TU CLICK)
          // mixed_shortcode = owner_shortcode + share_shortcode
          GET /question/:share_shortcode (en back getQuestion(:share_shortcode) => question(+owner)(responses(contributor)))
            Render all this things
            + Edition de question
            + Cloturer la question

            onClick Edit => POST /question/:mixed_shortcode/edit (question) => {
              SAVE question
                onBefore, check mixed_shortcode (check owner_shortcode exist and are linked to good share_shortcode )
              return STATE;
            }

            onDelete Edit => DELETE /question/:mixed_shortcode/delete => {
              via owner_shortcode (find question_id)
                Delete question
                  Archive responses
                  Archive contributors
                  Archive owner
                  Proposer de récupérer résumé en zip par email
                  return {
                    redirect to /thankyou and button to go home
                  }

              return STATE;
            }

---

- `npm install`
- `npm run watch`
