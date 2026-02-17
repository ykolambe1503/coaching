package com.coaching.platform.controller;

import com.coaching.platform.dto.BatchRequest;
import com.coaching.platform.dto.BatchResponse;
import com.coaching.platform.exception.ResourceNotFoundException;
import com.coaching.platform.exception.UnauthorizedException;
import com.coaching.platform.service.BatchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BatchController.class)
@AutoConfigureMockMvc(addFilters = false)
class BatchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BatchService batchService;

    private BatchRequest batchRequest;
    private BatchResponse batchResponse;
    private UUID batchId;

    @BeforeEach
    void setUp() {
        batchId = UUID.randomUUID();

        batchRequest = new BatchRequest();
        batchRequest.setName("Test Batch");
        batchRequest.setDescription("Test Description");
        batchRequest.setStartDate(LocalDate.now());
        batchRequest.setEndDate(LocalDate.now().plusMonths(6));

        BatchResponse.UserSummary createdBy = BatchResponse.UserSummary.builder()
                .id(UUID.randomUUID())
                .username("admin")
                .firstName("Admin")
                .lastName("User")
                .email("admin@example.com")
                .build();

        batchResponse = BatchResponse.builder()
                .id(batchId)
                .name("Test Batch")
                .description("Test Description")
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusMonths(6))
                .createdBy(createdBy)
                .students(new HashSet<>())
                .faculty(new HashSet<>())
                .build();
    }

    @Test
    void createBatch_ValidRequest_ReturnsCreated() throws Exception {
        // Arrange
        when(batchService.createBatch(any(BatchRequest.class))).thenReturn(batchResponse);

        // Act & Assert
        mockMvc.perform(post("/api/batches")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(batchId.toString()))
                .andExpect(jsonPath("$.name").value("Test Batch"))
                .andExpect(jsonPath("$.description").value("Test Description"));
    }

    @Test
    void createBatch_Unauthorized_ReturnsForbidden() throws Exception {
        // Arrange
        when(batchService.createBatch(any(BatchRequest.class)))
                .thenThrow(new UnauthorizedException("Only ADMIN users can create batches"));

        // Act & Assert
        mockMvc.perform(post("/api/batches")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllBatches_ReturnsOk() throws Exception {
        // Arrange
        List<BatchResponse> batches = Arrays.asList(batchResponse);
        when(batchService.getAllBatches()).thenReturn(batches);

        // Act & Assert
        mockMvc.perform(get("/api/batches")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(batchId.toString()))
                .andExpect(jsonPath("$[0].name").value("Test Batch"));
    }

    @Test
    void getBatchById_ValidId_ReturnsOk() throws Exception {
        // Arrange
        when(batchService.getBatchById(batchId)).thenReturn(batchResponse);

        // Act & Assert
        mockMvc.perform(get("/api/batches/{id}", batchId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(batchId.toString()))
                .andExpect(jsonPath("$.name").value("Test Batch"));
    }

    @Test
    void getBatchById_InvalidId_ReturnsNotFound() throws Exception {
        // Arrange
        UUID invalidId = UUID.randomUUID();
        when(batchService.getBatchById(invalidId))
                .thenThrow(new ResourceNotFoundException("Batch not found"));

        // Act & Assert
        mockMvc.perform(get("/api/batches/{id}", invalidId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateBatch_ValidRequest_ReturnsOk() throws Exception {
        // Arrange
        when(batchService.updateBatch(eq(batchId), any(BatchRequest.class)))
                .thenReturn(batchResponse);

        // Act & Assert
        mockMvc.perform(put("/api/batches/{id}", batchId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(batchId.toString()))
                .andExpect(jsonPath("$.name").value("Test Batch"));
    }

    @Test
    void updateBatch_Unauthorized_ReturnsForbidden() throws Exception {
        // Arrange
        when(batchService.updateBatch(eq(batchId), any(BatchRequest.class)))
                .thenThrow(new UnauthorizedException("Only ADMIN users can update batches"));

        // Act & Assert
        mockMvc.perform(put("/api/batches/{id}", batchId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(batchRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteBatch_ValidId_ReturnsNoContent() throws Exception {
        // Arrange
        doNothing().when(batchService).deleteBatch(batchId);

        // Act & Assert
        mockMvc.perform(delete("/api/batches/{id}", batchId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteBatch_Unauthorized_ReturnsForbidden() throws Exception {
        // Arrange
        doThrow(new UnauthorizedException("Only ADMIN users can delete batches"))
                .when(batchService).deleteBatch(batchId);

        // Act & Assert
        mockMvc.perform(delete("/api/batches/{id}", batchId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void assignStudents_ValidRequest_ReturnsOk() throws Exception {
        // Arrange
        Set<UUID> studentIds = new HashSet<>(Arrays.asList(UUID.randomUUID()));
        when(batchService.assignStudents(eq(batchId), any(Set.class)))
                .thenReturn(batchResponse);

        // Act & Assert
        mockMvc.perform(post("/api/batches/{id}/assign-students", batchId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(studentIds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(batchId.toString()));
    }

    @Test
    void assignStudents_Unauthorized_ReturnsForbidden() throws Exception {
        // Arrange
        Set<UUID> studentIds = new HashSet<>(Arrays.asList(UUID.randomUUID()));
        when(batchService.assignStudents(eq(batchId), any(Set.class)))
                .thenThrow(new UnauthorizedException("Only ADMIN users can assign students"));

        // Act & Assert
        mockMvc.perform(post("/api/batches/{id}/assign-students", batchId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(studentIds)))
                .andExpect(status().isForbidden());
    }

    @Test
    void assignFaculty_ValidRequest_ReturnsOk() throws Exception {
        // Arrange
        Set<UUID> facultyIds = new HashSet<>(Arrays.asList(UUID.randomUUID()));
        when(batchService.assignFaculty(eq(batchId), any(Set.class)))
                .thenReturn(batchResponse);

        // Act & Assert
        mockMvc.perform(post("/api/batches/{id}/assign-faculty", batchId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(facultyIds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(batchId.toString()));
    }

    @Test
    void assignFaculty_Unauthorized_ReturnsForbidden() throws Exception {
        // Arrange
        Set<UUID> facultyIds = new HashSet<>(Arrays.asList(UUID.randomUUID()));
        when(batchService.assignFaculty(eq(batchId), any(Set.class)))
                .thenThrow(new UnauthorizedException("Only ADMIN users can assign faculty"));

        // Act & Assert
        mockMvc.perform(post("/api/batches/{id}/assign-faculty", batchId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(facultyIds)))
                .andExpect(status().isForbidden());
    }
}
