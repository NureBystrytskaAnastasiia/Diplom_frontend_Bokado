import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { GetGroupDto, CreateGroupDto, UpdateGroupDto } from '../types/group';
import {
  getGroups,
  getGroup,
  getRecommendations,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  kickMember,
  assignAdmin,
  closeGroup,
  startGroupCall,
} from '../api/groups';

interface GroupsState {
  // Списки
  groups: GetGroupDto[];
  recommendations: GetGroupDto[];

  // Поточна відкрита група
  currentGroup: GetGroupDto | null;

  // Стани завантаження
  loading: boolean;
  recommendationsLoading: boolean;
  currentGroupLoading: boolean;

  // Дія над групою (join/leave/kick тощо)
  actionLoading: boolean;

  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  recommendations: [],
  currentGroup: null,
  loading: false,
  recommendationsLoading: false,
  currentGroupLoading: false,
  actionLoading: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────

export const loadGroups = createAsyncThunk(
  'groups/loadGroups',
  async (_, thunkAPI) => {
    try { return await getGroups(); }
    catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка завантаження груп'); }
  }
);

export const loadGroup = createAsyncThunk(
  'groups/loadGroup',
  async (groupId: number, thunkAPI) => {
    try { return await getGroup(groupId); }
    catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data?.message || 'Групу не знайдено'); }
  }
);

export const loadRecommendations = createAsyncThunk(
  'groups/loadRecommendations',
  async (_, thunkAPI) => {
    try { return await getRecommendations(); }
    catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка рекомендацій'); }
  }
);

export const createNewGroup = createAsyncThunk(
  'groups/createGroup',
  async (dto: CreateGroupDto, thunkAPI) => {
    try { return await createGroup(dto); }
    catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка створення групи'); }
  }
);

export const editGroup = createAsyncThunk(
  'groups/editGroup',
  async ({ groupId, dto }: { groupId: number; dto: UpdateGroupDto }, thunkAPI) => {
    try {
      await updateGroup(groupId, dto);
      return { groupId, dto };
    } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка редагування'); }
  }
);

export const removeGroup = createAsyncThunk(
  'groups/deleteGroup',
  async (groupId: number, thunkAPI) => {
    try {
      await deleteGroup(groupId);
      return groupId;
    } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка видалення'); }
  }
);

export const joinGroupById = createAsyncThunk(
  'groups/joinGroup',
  async (groupId: number, thunkAPI) => {
    try {
      await joinGroup(groupId);
      return groupId;
    } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка вступу до групи'); }
  }
);

export const leaveGroupById = createAsyncThunk(
  'groups/leaveGroup',
  async (groupId: number, thunkAPI) => {
    try {
      await leaveGroup(groupId);
      return groupId;
    } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка виходу з групи'); }
  }
);

export const kickMemberById = createAsyncThunk(
  'groups/kickMember',
  async ({ groupId, targetUserId }: { groupId: number; targetUserId: number }, thunkAPI) => {
    try {
      await kickMember(groupId, targetUserId);
      return { groupId, targetUserId };
    } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка виключення'); }
  }
);

export const assignAdminById = createAsyncThunk(
  'groups/assignAdmin',
  async ({ groupId, targetUserId }: { groupId: number; targetUserId: number }, thunkAPI) => {
    try {
      await assignAdmin(groupId, targetUserId);
      return { groupId, targetUserId };
    } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка призначення адміна'); }
  }
);

export const closeGroupById = createAsyncThunk(
  'groups/closeGroup',
  async (groupId: number, thunkAPI) => {
    try {
      await closeGroup(groupId);
      return groupId;
    } catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка закриття групи'); }
  }
);

export const startCall = createAsyncThunk(
  'groups/startCall',
  async (groupId: number, thunkAPI) => {
    try { return await startGroupCall(groupId); }
    catch (e: any) { return thunkAPI.rejectWithValue(e.response?.data || 'Помилка запуску дзвінка'); }
  }
);

// ─── Slice ────────────────────────────────────────────────

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearCurrentGroup: (state) => { state.currentGroup = null; },
  },
  extraReducers: (builder) => {
    builder
      // loadGroups
      .addCase(loadGroups.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(loadGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // loadGroup
      .addCase(loadGroup.pending, (state) => { state.currentGroupLoading = true; state.error = null; })
      .addCase(loadGroup.fulfilled, (state, action) => {
        state.currentGroupLoading = false;
        state.currentGroup = action.payload;
      })
      .addCase(loadGroup.rejected, (state, action) => {
        state.currentGroupLoading = false;
        state.error = action.payload as string;
      })

      // loadRecommendations
      .addCase(loadRecommendations.pending, (state) => { state.recommendationsLoading = true; })
      .addCase(loadRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(loadRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.error = action.payload as string;
      })

      // createNewGroup
      .addCase(createNewGroup.pending, (state) => { state.actionLoading = true; })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.groups.unshift(action.payload);
      })
      .addCase(createNewGroup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // editGroup
      .addCase(editGroup.fulfilled, (state, action) => {
        const { groupId, dto } = action.payload;
        const g = state.groups.find(g => g.groupId === groupId);
        if (g) Object.assign(g, dto);
        if (state.currentGroup?.groupId === groupId) Object.assign(state.currentGroup, dto);
      })
      .addCase(editGroup.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // removeGroup
      .addCase(removeGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(g => g.groupId !== action.payload);
        if (state.currentGroup?.groupId === action.payload) state.currentGroup = null;
      })
      .addCase(removeGroup.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // joinGroup — після вступу перезавантажимо групу через loadGroup
      .addCase(joinGroupById.pending, (state) => { state.actionLoading = true; })
      .addCase(joinGroupById.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(joinGroupById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // leaveGroup
      .addCase(leaveGroupById.pending, (state) => { state.actionLoading = true; })
      .addCase(leaveGroupById.fulfilled, (state) => { state.actionLoading = false; })
      .addCase(leaveGroupById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // kickMember — прибираємо з currentGroup локально
      .addCase(kickMemberById.fulfilled, (state, action) => {
        const { targetUserId } = action.payload;
        if (state.currentGroup) {
          state.currentGroup.members = state.currentGroup.members.filter(
            m => m.userId !== targetUserId
          );
        }
      })
      .addCase(kickMemberById.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // assignAdmin — оновлюємо роль локально
      .addCase(assignAdminById.fulfilled, (state, action) => {
        const { targetUserId } = action.payload;
        if (state.currentGroup) {
          const member = state.currentGroup.members.find(m => m.userId === targetUserId);
          if (member) member.role = 'Admin';
        }
      })
      .addCase(assignAdminById.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // closeGroup
      .addCase(closeGroupById.fulfilled, (state, action) => {
        const g = state.groups.find(g => g.groupId === action.payload);
        if (g) g.status = 'Closed';
        if (state.currentGroup?.groupId === action.payload) state.currentGroup.status = 'Closed';
      })
      .addCase(closeGroupById.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // startCall — просто повертає посилання, обробляємо в компоненті
      .addCase(startCall.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentGroup } = groupsSlice.actions;
export default groupsSlice.reducer;