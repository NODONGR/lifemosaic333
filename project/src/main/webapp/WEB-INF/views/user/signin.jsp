<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Spring 2</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossorigin="anonymous">
</head>
<body>
<div class="container-fluid">
    <c:set var="title" value="로그인" />
    <%@ include file="../fragments/title.jspf" %>

    <main class="my-2">
        <div class="my-2 card card-body">
            <!--  form action 속성이 설정되어 있지 않으면 현재 페이지(URL)로 submit -->
            <form method="post">
                <c:if test="${not empty param.result && param.result eq 'f'}">
                    <div class="text-danger">아이디와 패스워드를 확인하세요...</div>
                    <!--  로그인 실패 후 다시 로그인 페이지로 이동했을 때 경고 메시지 -->
                </c:if>
                <div class="my-2">
                    <input type="text" class="form-control"
                           name="user_id" placeholder="아이디" required autofocus />
                </div>
                <div class="my-2">
                    <input type="password" class="form-control"
                           name="password" placeholder="비밀번호" required />
                </div>
                <div class="my-2">
                    <input type="submit" class="form-control btn btn-success"
                           value="로그인" />
                </div>
                <!-- 여기에 회원가입 링크를 추가합니다 -->
                <div class="text-center">
                    <a href="<c:url value='/user/signup'/>" class="text-secondary">회원가입</a>
                </div>
            </form>
        </div>
    </main>

</div>


<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossorigin="anonymous"></script>
</body>
</html>