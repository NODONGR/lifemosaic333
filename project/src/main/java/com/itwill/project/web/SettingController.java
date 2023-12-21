package com.itwill.project.web;

import java.awt.PageAttributes.MediaType;
import java.io.File;
import java.io.IOException;
import java.net.http.HttpHeaders;
import java.nio.file.Files;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.itwill.project.domain.SettingUser;
import com.itwill.project.dto.setting.FileUtil;
import com.itwill.project.dto.setting.PasswordChangeDto;
import com.itwill.project.service.ChangePasswordServiceImpl;
import com.itwill.project.service.SettingService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/setting")// SettingController의 컨트롤러 메서드의 매핑 URL(주소)는 "/setting"로 시작.
@RequiredArgsConstructor
public class SettingController {
	
	private final SettingService settingService;
	private final ChangePasswordServiceImpl changePasswordService;
	
	@GetMapping("/userProfile")
	public void userProfile(Model model, HttpSession session) {
		log.debug("SettingService={}",settingService);
		log.debug("SettingController: userProfile() 호출");
		String user_id = (String) session.getAttribute("signedInUser");
		SettingUser user = settingService.read(user_id);
		
		model.addAttribute("user",user);
	
	}
	
	@GetMapping("/userManagement")
    public String userManagement() {
        log.debug("SettingController: userManagement() 호출");
        // "userManagement" 뷰로 리디렉션
        return "setting/userManagement"; // 여기서 "userManagement"는 해당 뷰의 이름입니다.
    }
	
	@PostMapping("/verifyPassword")
	@ResponseBody
	public ResponseEntity<?> verifyCurrentPassword(HttpSession session, @RequestBody Map<String, String> payload) {
	    String currentPassword = payload.get("currentPassword");
	    String user_id = (String) session.getAttribute("signedInUser"); // 세션에서 사용자 ID 가져오기
	    // 비밀번호 검증 로직
	    boolean isPasswordCorrect = changePasswordService.verifyCurrentPassword(user_id, currentPassword);
	    if (isPasswordCorrect) {
	        return ResponseEntity.ok().build();
	    } else {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
	    }
	}
	
	@PostMapping("/changePassword")
	@ResponseBody
	public ResponseEntity<?> changePassword(HttpSession session, @RequestBody Map<String, String> payload) {
	    String currentPassword = payload.get("currentPassword");
	    String newPassword = payload.get("newPassword");
	    String userId = (String) session.getAttribute("signedInUser"); // 세션에서 사용자 ID 가져오기

	    // 현재 비밀번호가 맞는지 검증
	    boolean isPasswordCorrect = changePasswordService.verifyCurrentPassword(userId, currentPassword);
	    if (!isPasswordCorrect) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("현재 비밀번호가 올바르지 않습니다.");
	    }

	    // 새 비밀번호로 변경
	    PasswordChangeDto passwordChangeDto = new PasswordChangeDto();
	    passwordChangeDto.setUser_id(userId);
	    passwordChangeDto.setCurrentPassword(currentPassword);
	    passwordChangeDto.setNewPassword(newPassword);

	    boolean isChanged = changePasswordService.changePassword(passwordChangeDto);
	    if (isChanged) {
	        return ResponseEntity.ok().body("비밀번호가 변경되었습니다.");
	    } else {
	        return ResponseEntity.badRequest().body("비밀번호 변경에 실패하였습니다.");
	    }
	}
	
	@GetMapping("/checkNickname")
	@ResponseBody
	public ResponseEntity<String> checkNickname(@RequestParam(name="nickname") String nickname){
		log.debug("checkNickname={}",nickname);
		
		//서비스 메서드를 호출해서 닉네임 중복확인을 체크한다.
		boolean result = settingService.checkNickname(nickname);
		
		if(result) {
			return ResponseEntity.ok("YYY");
		}else {
			return ResponseEntity.ok("NNN");
		}
	}
	
	@PostMapping("/updateImg")
	public String updateImg(@RequestParam("profile") MultipartFile file, HttpSession session, String user_id)
	        throws Exception {
	    log.debug("updateImg(!!!!!!!!!!!!!!!!!!!!)");
	    FileUtil fileUtil = new FileUtil();
	    log.debug(file.toString());
        String profile_url = fileUtil.updateImg(file);
        log.debug("profile_url={}",profile_url);

     settingService.updateImg(user_id, profile_url);
     
    
	    return "redirect:/setting/userProfile";
	}

	

	
}
