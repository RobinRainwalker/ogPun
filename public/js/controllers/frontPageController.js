$(() => {
  console.log('front page loaded');

  $('.submit-pun').on('submit', (event) => {
      event.preventDefault();
      const punText = $('.pun-text-input').val();
      const quoteId = $('#quoteId').text();
      const comment = { punText: punText, quoteId: quoteId }
      console.log(comment);
      $.ajax({
          method: 'POST',
          url: '/comment',
          data: comment,
          success: (response) => {
              console.log(response);
              window.location.replace(`/front`);
          },
          error: (msg) => {
              console.log(msg);
          }
      }); // ends ajax method
  });

  $('.groan').on('click', (event) => {
      event.preventDefault();
      const commentId = $(event.target).children().text();
      console.log('groaned comment: ', commentId);
      const groan = { commentId: commentId }
      $.ajax({
          method: 'POST',
          url: '/groan',
          data: groan,
          success: (response) => {
              console.log(response);
              window.location.replace('/front');
          },
          error: (msg) => {
            console.log(msg);
          }
      });
  });

  $('.giggle').on('click', (event) => {
      event.preventDefault();
      const commentId = $(event.target).children().text();
      console.log('giggled comment: ', commentId);
      const giggle = { commentId: commentId }
      $.ajax({
          method: 'POST',
          url: '/giggle',
          data: giggle,
          success: (response) => {
              console.log(response);
              window.location.replace('/front');
          },
          error: (msg) => {
            console.log(msg);
          }
      });
  });

});
