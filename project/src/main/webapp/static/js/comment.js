/**
 * comment.js
 * 
 */

 document.addEventListener('DOMContentLoaded', () =>{
    
    commentCheck();
    

    
    // 해당 게시글에 코멘트 유무를 체크
    function commentCheck() {
        const post_id = document.querySelector('input#post_id').value;
        
        axios.get('../api/comment/check', { params: {post_id: post_id} })
            .then((response) => {
                console.log(response);
                if (response.data === 0) {
                    emptyComment();
                } else {
                    getAllComment();
                }
            }) 
            .catch((error) => {
                console.log(error);
            });
           
    } // end commentCheck
    
    // 게시글에 코멘트가 없을 시
    function emptyComment() {
        const empty = document.querySelector('div#comments')
        
        empty.innerHTML = '<div> * 해당 게시물에 아직 댓글이 없습니다.</div>'
    } //end emptyComment
    
    // 게시글에 코멘트가 있을 시 코멘트 데이터를 보냄
    function getAllComment() {
        const post_id = document.querySelector('input#post_id').value
        
        axios.get('../api/comment/get', { params: {post_id: post_id} })
            .then((response) => {
                console.log(response);
                makeCommentElements(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    // 버튼 등록과 이벤트 리스너 등록
    const btnRegisterComment = document.querySelector('button#btnRegisterComment');
    btnRegisterComment.addEventListener('click', registerComment);
    
    function registerComment(event) {

        const post_id = document.querySelector('input#post_id').value;

        const ctext = document.querySelector('textarea#ctext').value;

        const writer = document.querySelector('input#writer').value;
        
        // 댓글 내용이 비어 있는 지 체크.
        if (ctext === '') {
            alert('댓글 내용을 입력하세요.');
            return; // 이벤트 콜백 종료
        }

        const data = { post_id, ctext, writer };
        console.log(data);
        
        // POST 방식의 Ajax 요청을 보냄. 응답/실패 콜백을 등록.
        axios.post('../api/comment', data) // post 방식의 Ajax 요청으로 data를 보냄.
            .then((response) => {
                console.log(response);
                if (response.data === 1) {
                    document.querySelector('textarea#ctext').value = '';
                    getAllComment();
                }
            }) 
            .catch((error) => {
                console.log(error);
            });
    } // end function registerComment
    
    // 코멘트와 페이징을 추가
    function makeCommentElements(data){
        const commentsContainer = document.querySelector('div#comments');
        const pageContainer = document.querySelector('div#pageContainer');
        
        
        const comments = data.comments;
        console.log(comments);
        const pageMaker = data.pageMaker; 
        console.log(pageMaker);
        
        let html = '';
        
        comments.forEach((comment) => {
            
            const commentcTime = new Date(comment.comment_created_time);
            const commentTime = new Date(comment.comment_modified_time);
            const formattedcTime = commentcTime.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', 
                                                        hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const formattedTime = commentTime.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', 
                                                        hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            html += `<div class="mx-5 my-2">
                        <input class="d-none" id="${comment.comment_id}"/>
                        <span>${comment.nickname}</span> 
                        <small class=time>${formattedTime}</small>`;
                if(commentcTime !== commentTime){

                html += `<small>*수정됨</small>`;
                }
                   
            html += `<div style="float: right;">
                        <small id="commentLike" data-id="${comment.comment_id}" style="cursor: pointer;">👍좋아요</small>
                        <small>${comment.like_point}</small>
                        <small id="commentDisLike" data-id="${comment.comment_id}" style="cursor: pointer;">👎싫어요</small>
                        <small>${comment.dislike_point}</small>`;
                if(signedInUser === comment.user_id) {
        
                html+= `<small class="btnCommentModify" data-id="${comment.comment_id}" style="cursor: pointer;"> 수정</small>
                        <small class="btnCommentDelete" data-id="${comment.comment_id}" style="cursor: pointer;">삭제</small>`;
                }  
                    
            html += `</div>
                        <div>
                            <h6>${comment.comment_content}</h6>
                        </div>
                        <div>
                            <small data-id="${comment.comment_id}"id="showRecomment">답글 보기 ▼</small>
                        </div>
                        <div class="multiUseDiv" data-id="${comment.comment_id}"></div>
                    </div>
                    <hr />`;
                
            });
            
            commentsContainer.innerHTML = html;
            
            let pageHtml = '';
            
            pageHtml += `<nav aria-label="Page navigation example">
                        <ul class="pagination justify-content-center">`;
                if(pageMaker.prev) {
                
                pageHtml += `<li class="page-item">
                            <a class="page-link"
                            value="${pageMaker.startPage-1}">Previous</a>
                         </li>`;
                }
                        
            const startPage = pageMaker.startPage;
            const endPage = pageMaker.endPage;
            const pageNum = pageMaker.cri.pageNum;
            
            for (let num = startPage; num <= endPage; num++) {
                const isActive = (pageNum === num) ? 'active' : '';
                const link = (pageNum === num) ? '<span class="page-link disabled">' + num + '</span>' 
                                                : '<a class="page-link" value="' + num + '">' + num + '</a>';
  
                pageHtml += '<li class="page-item ' + isActive + '">' + link + '</li>';
            }

                if(pageMaker.next) {
                    
                    html+= `<li class="page-item"><a class="page-link"
                    value=${pageMaker.endPage + 1}">Next</a>
                    </li>`;
                }
            pageHtml += `</ul>
                    </nav>`;
                    
            pageContainer.innerHTML = pageHtml;
            
            addPageLinkEventListeners();
            addCommentModifyEventListeners();
            time();
            
    } // end makeCommentElements
    
    // 페이지 버튼에 이벤트 리스너를 추가
    function addPageLinkEventListeners() {
        const pageLinks = document.querySelectorAll('a.page-link');
        const post_id = document.querySelector('input#post_id').value;
        pageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageNum = this.getAttribute('value');
                console.log(pageNum);
                
            axios.get('../api/comment/get', { params: {post_id: post_id, pageNum: pageNum} })
            .then((response) => {
                console.log(response);
                makeCommentElements(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
                
            });
        });
    } //end addPageLinkEventListeners
    
    function addCommentModifyEventListeners() {
        const btnCommentModifyElements = document.querySelectorAll('small.btnCommentModify');
        btnCommentModifyElements.forEach(btn => {
          btn.addEventListener('click', function() {
            const comment_id = this.getAttribute('data-id');
            const multiUseDiv = document.querySelector(`div.multiUseDiv[data-id="${comment_id}"]`);
        
            // 수정할 댓글을 입력할 input 요소를 동적으로 생성하여 multiUseDiv에 추가
            multiUseDiv.innerHTML = `<textarea class="form-control" id="recommentText"placeholder="수정할 댓글 입력"></textarea>
                                    <button class="btn btn-outline-success" id="btnRegisterRecomment">등록</button>`
            
            // 수정된 댓글 저장 버튼 클릭 이벤트 처리
            const btnRegisterRecomment = document.querySelector('button#btnRegisterRecomment');
            btnRegisterRecomment.addEventListener('click', function() {

                const ctext = document.querySelector('textarea#recommentText').value;

        
        // 댓글 내용이 비어 있는 지 체크.
                if (ctext === '') {
                    alert('댓글 내용을 입력하세요.');
                    return; // 이벤트 콜백 종료
                }

                const data = { comment_id, ctext };
                console.log(data);
              
                axios.put('../api/comment/update', data)
                .then((response) => {
                    console.log(response);
                    getAllComment();
                })
                .catch((error) => {
                    console.log(error);
                });
              
             });
          });
        });
    }
    
    function timeAgo(date) {
          const now = new Date();
          const created = new Date(date);
        
          const seconds = Math.floor((now - created) / 1000);
          let interval = Math.floor(seconds / 31536000);
        
          if (interval >= 1) {
            return `${interval}년 전`;
          }
          interval = Math.floor(seconds / 2592000);
          if (interval >= 1) {
            return `${interval}개월 전`;
          }
          interval = Math.floor(seconds / 86400);
          if (interval >= 1) {
            return `${interval}일 전`;
          }
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            return `${interval}시간 전`;
          }
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            return `${interval}분 전`;
          }
          return `${Math.floor(seconds)}초 전`;
        }

        function time() {
            const timeElements = document.querySelectorAll('.time');
    
            timeElements.forEach((timeElement) => {
            const date = new Date(timeElement);
            const formatter = new Intl.DateTimeFormat('ko-KR', { 
              year: 'numeric', month: 'long', day: 'numeric', 
              hour: 'numeric', minute: 'numeric', second: 'numeric' 
            });
            var formattedDate = formatter.format(date); 
            });
            
        }

    
    
 });